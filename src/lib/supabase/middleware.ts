import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // Check if this visitor has already seen onboarding (stored as a cookie)
  const hasSeenOnboarding = request.cookies.get('lifeflow_onboarding_seen')?.value === 'true'

  const isOnboardingRoute = url.pathname === '/onboarding'
  const isRootRoute = url.pathname === '/'
  const authRoutes = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password', '/admin/login', '/admin/register']
  const setupRoutes = ['/profile-setup']
  const dashboardRoutes = ['/donor', '/admin']

  const isAuthRoute = authRoutes.some(r => url.pathname.startsWith(r))
  const isSetupRoute = setupRoutes.some(r => url.pathname.startsWith(r))
  const adminAuthRoutes = ['/admin/login', '/admin/register']
  const isAdminAuthRoute = adminAuthRoutes.some(r => url.pathname.startsWith(r))
  const isDashboardRoute = dashboardRoutes.some(r => url.pathname.startsWith(r)) && !isAdminAuthRoute

  // ── ONBOARDING GATE ──────────────────────────────────────────────────────
  // First-time visitor hitting root → show onboarding first
  if (isRootRoute && !hasSeenOnboarding && !user) {
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Already seen onboarding → root goes to login
  if (isRootRoute && hasSeenOnboarding && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Trying to visit /onboarding again after already seen it → go to login
  if (isOnboardingRoute && hasSeenOnboarding && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ── UNAUTHENTICATED ───────────────────────────────────────────────────────
  if (!user) {
    if (isDashboardRoute || isSetupRoute) {
      url.pathname = hasSeenOnboarding ? '/login' : '/onboarding'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // ── AUTHENTICATED ─────────────────────────────────────────────────────────

  // Fetch profile once for role/profile_completed checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_completed, role')
    .eq('id', user.id)
    .single()

  // Logged-in users should never see auth or onboarding pages
  if (isAuthRoute || isOnboardingRoute || isRootRoute) {
    url.pathname = profile?.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'
    return NextResponse.redirect(url)
  }

  // Check dashboard access rules
  if (isDashboardRoute) {
    // Admins bypass donor profile completion and go straight to admin area
    if (profile?.role === 'admin') {
      if (url.pathname.startsWith('/donor')) {
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // Donors must complete profile before accessing dashboards
    if (!profile?.profile_completed) {
      url.pathname = '/profile-setup/step-1'
      return NextResponse.redirect(url)
    }
  }

  // Profile already completed → skip setup (donors only)
  if (isSetupRoute && profile?.profile_completed) {
    url.pathname = '/donor/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}