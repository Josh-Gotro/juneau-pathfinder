import { buildAppleMapsUrl, buildDirectionsUrl, isAppleMobile } from '../directions'

const AMALGA = '58.528461, -134.806618'
const CAPITOL = '120 4th St, Juneau, AK 99801'

const withUserAgent = (userAgent: string, maxTouchPoints: number, run: () => void) => {
  const originalUA = Object.getOwnPropertyDescriptor(window.navigator, 'userAgent')
  const originalTouch = Object.getOwnPropertyDescriptor(window.navigator, 'maxTouchPoints')

  Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true })
  Object.defineProperty(window.navigator, 'maxTouchPoints', {
    value: maxTouchPoints,
    configurable: true,
  })

  try {
    run()
  } finally {
    if (originalUA) Object.defineProperty(window.navigator, 'userAgent', originalUA)
    if (originalTouch) Object.defineProperty(window.navigator, 'maxTouchPoints', originalTouch)
  }
}

describe('buildAppleMapsUrl', () => {
  it('passes coordinates through as a bare lat,lng pair', () => {
    const url = buildAppleMapsUrl(AMALGA, 'driving')
    expect(url).toContain('daddr=58.528461%2C-134.806618')
  })

  it('encodes an address destination', () => {
    const url = buildAppleMapsUrl(CAPITOL, 'walking')
    expect(url).toContain(`daddr=${encodeURIComponent(CAPITOL)}`)
  })

  it('maps each travel mode to its dirflg', () => {
    expect(buildAppleMapsUrl(AMALGA, 'walking')).toContain('dirflg=w')
    expect(buildAppleMapsUrl(AMALGA, 'driving')).toContain('dirflg=d')
    expect(buildAppleMapsUrl(AMALGA, 'transit')).toContain('dirflg=r')
  })

  it('uses the https universal link rather than the maps:// scheme', () => {
    // The https form opens the app on iOS and still resolves elsewhere, so
    // there is never a dead link to handle.
    expect(buildAppleMapsUrl(AMALGA, 'driving')).toMatch(/^https:\/\/maps\.apple\.com\//)
  })
})

describe('buildDirectionsUrl', () => {
  it('routes to Apple Maps for the apple provider', () => {
    expect(buildDirectionsUrl('apple', AMALGA, 'driving')).toContain('maps.apple.com')
  })

  it('routes to Google Maps for the google provider', () => {
    expect(buildDirectionsUrl('google', AMALGA, 'driving')).toContain('google.com/maps')
  })
})

describe('isAppleMobile', () => {
  it('detects an iPhone', () => {
    withUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 5, () => {
      expect(isAppleMobile()).toBe(true)
    })
  })

  it('detects an iPad reporting a Macintosh user agent', () => {
    // iPadOS 13+ masquerades as desktop Safari; touch points are the tell.
    withUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5, () => {
      expect(isAppleMobile()).toBe(true)
    })
  })

  it('does not treat a desktop Mac as mobile', () => {
    withUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0, () => {
      expect(isAppleMobile()).toBe(false)
    })
  })

  it('does not treat Android as Apple', () => {
    withUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8)', 5, () => {
      expect(isAppleMobile()).toBe(false)
    })
  })
})
