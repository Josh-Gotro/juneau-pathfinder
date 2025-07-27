import { trailheads } from '../trailheads'

describe('Trailhead Data', () => {
  describe('Data Structure', () => {
    it('exports trailheads array', () => {
      expect(Array.isArray(trailheads)).toBe(true)
      expect(trailheads.length).toBeGreaterThan(0)
    })

    it('has correct structure for each trailhead', () => {
      trailheads.forEach(trailhead => {
        expect(trailhead).toHaveProperty('name')
        expect(trailhead).toHaveProperty('entrances')
        expect(typeof trailhead.name).toBe('string')
        expect(Array.isArray(trailhead.entrances)).toBe(true)
        expect(trailhead.entrances.length).toBeGreaterThan(0)
      })
    })

    it('has correct structure for each entrance', () => {
      trailheads.forEach(trailhead => {
        trailhead.entrances.forEach(entrance => {
          expect(entrance).toHaveProperty('name')
          expect(entrance).toHaveProperty('query')
          expect(typeof entrance.name).toBe('string')
          expect(typeof entrance.query).toBe('string')
          
          // Optional properties
          if (entrance.milemarker !== undefined && entrance.milemarker !== null) {
            expect(typeof entrance.milemarker).toBe('string')
          }
          if (entrance.notes !== undefined && entrance.notes !== null) {
            expect(typeof entrance.notes).toBe('string')
          }
          if (entrance.source !== undefined && entrance.source !== null) {
            expect(typeof entrance.source).toBe('string')
          }
          if (entrance.googleMapsUrl !== undefined && entrance.googleMapsUrl !== null) {
            expect(typeof entrance.googleMapsUrl).toBe('string')
          }
          if (entrance.connection !== undefined && entrance.connection !== null) {
            expect(typeof entrance.connection).toBe('boolean')
          }
        })
      })
    })
  })

  describe('Data Validation', () => {
    it('has unique trailhead names', () => {
      const names = trailheads.map(t => t.name)
      const uniqueNames = new Set(names)
      expect(names.length).toBe(uniqueNames.size)
    })

    it('has unique entrance names within each trailhead', () => {
      trailheads.forEach(trailhead => {
        const entranceNames = trailhead.entrances.map(e => e.name)
        const uniqueEntranceNames = new Set(entranceNames)
        expect(entranceNames.length).toBe(uniqueEntranceNames.size)
      })
    })

    it('has valid coordinate queries', () => {
      trailheads.forEach(trailhead => {
        trailhead.entrances.forEach(entrance => {
          // Check if query follows coordinate format (latitude, longitude) or is an address
          const coordinatePattern = /^-?\d+\.\d+,\s*-?\d+\.\d+$/
          const addressPattern = /^[^,]+,\s*[^,]+,\s*[A-Z]{2}\s*\d{5}$/
          const isCoordinate = coordinatePattern.test(entrance.query)
          const isAddress = addressPattern.test(entrance.query)
          expect(isCoordinate || isAddress).toBe(true)
        })
      })
    })

    it('has valid URLs when provided', () => {
      trailheads.forEach(trailhead => {
        trailhead.entrances.forEach(entrance => {
          if (entrance.googleMapsUrl) {
            expect(entrance.googleMapsUrl).toMatch(/^https?:\/\//)
          }
          if (entrance.source && entrance.source !== 'google maps') {
            expect(entrance.source).toMatch(/^https?:\/\//)
          }
        })
      })
    })
  })

  describe('Specific Trailhead Tests', () => {
    it('has Treadwell Ditch with multiple entrances', () => {
      const treadwell = trailheads.find(t => t.name === 'Treadwell Ditch')
      expect(treadwell).toBeDefined()
      expect(treadwell!.entrances.length).toBeGreaterThan(1)
      
      const entranceNames = treadwell!.entrances.map(e => e.name)
      expect(entranceNames).toContain('Blueberry Hill Entrance')
      expect(entranceNames).toContain('Eagle Crest Entrance')
      expect(entranceNames).toContain('Sandy Beach Entrance')
    })

    it('has Amalga Trail with single entrance and mile marker', () => {
      const amalga = trailheads.find(t => t.name === 'Amalga')
      expect(amalga).toBeDefined()
      expect(amalga!.entrances.length).toBe(1)
      expect(amalga!.entrances[0].milemarker).toBe('27.2')
      expect(amalga!.entrances[0].notes).toContain('Eagle River')
    })

    it('has Mt. Juneau Trailhead with multiple entrances including connection', () => {
      const mtJuneau = trailheads.find(t => t.name === 'Mt. Juneau')
      expect(mtJuneau).toBeDefined()
      expect(mtJuneau!.entrances.length).toBeGreaterThan(1)
      
      const connectionEntrance = mtJuneau!.entrances.find(e => e.connection === true)
      expect(connectionEntrance).toBeDefined()
      expect(connectionEntrance!.name).toBe('Connection to Perseverance')
    })

    it('has Perseverance Trailhead with multiple entrances', () => {
      const perseverance = trailheads.find(t => t.name === 'Perseverance')
      expect(perseverance).toBeDefined()
      expect(perseverance!.entrances.length).toBeGreaterThan(1)
      
      const entranceNames = perseverance!.entrances.map(e => e.name)
      expect(entranceNames).toContain('Lot Entrance')
      expect(entranceNames).toContain('Ramp Entrance')
    })
  })

  describe('Data Completeness', () => {
    it('has all required trailheads', () => {
      const expectedTrailheads = [
        'Amalga',
        'Mt. Juneau',
        'Mt. Roberts & Gastineau',
        'East Glacier',
        'Point Bridget',
        'Perseverance',
        'Salmon Creek',
        'Spaulding Meadows + Auke Nu',
        'Treadwell Ditch',
        'West Glacier'
      ]
      
      const actualTrailheadNames = trailheads.map(t => t.name)
      expectedTrailheads.forEach(expectedName => {
        expect(actualTrailheadNames).toContain(expectedName)
      })
    })

    it('has at least one entrance per trailhead', () => {
      trailheads.forEach(trailhead => {
        expect(trailhead.entrances.length).toBeGreaterThan(0)
      })
    })

    it('has valid coordinate data for all entrances', () => {
      trailheads.forEach(trailhead => {
        trailhead.entrances.forEach(entrance => {
          // Skip address-based queries
          if (entrance.query.includes('St,') || entrance.query.includes('AK')) {
            return
          }
          const [lat, lng] = entrance.query.split(',').map(s => parseFloat(s.trim()))
          expect(lat).toBeGreaterThan(58) // Juneau area latitude
          expect(lat).toBeLessThan(59)
          expect(lng).toBeGreaterThan(-135) // Juneau area longitude
          expect(lng).toBeLessThan(-134)
        })
      })
    })
  })

  describe('Type Safety', () => {
    it('has correct TypeScript types', () => {
      // This test ensures the data matches the TypeScript interfaces
      trailheads.forEach(trailhead => {
        // Trailhead interface
        expect(typeof trailhead.name).toBe('string')
        expect(Array.isArray(trailhead.entrances)).toBe(true)
        
        trailhead.entrances.forEach(entrance => {
          // TrailheadEntrance interface
          expect(typeof entrance.name).toBe('string')
          expect(typeof entrance.query).toBe('string')
          
          // Optional properties should be the correct type when present
          if (entrance.milemarker !== undefined && entrance.milemarker !== null) {
            expect(typeof entrance.milemarker).toBe('string')
          }
          if (entrance.notes !== undefined && entrance.notes !== null) {
            expect(typeof entrance.notes).toBe('string')
          }
          if (entrance.source !== undefined && entrance.source !== null) {
            expect(typeof entrance.source).toBe('string')
          }
          if (entrance.googleMapsUrl !== undefined && entrance.googleMapsUrl !== null) {
            expect(typeof entrance.googleMapsUrl).toBe('string')
          }
          if (entrance.connection !== undefined && entrance.connection !== null) {
            expect(typeof entrance.connection).toBe('boolean')
          }
        })
      })
    })
  })
}) 