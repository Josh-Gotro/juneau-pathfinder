export interface TrailheadEntrance {
  name: string
  query: string
  connection?: boolean | null
  milemarker?: string | null
  notes?: string | null
  source?: string | null
  googleMapsUrl?: string | null
}

export interface Trailhead {
  name: string
  entrances: TrailheadEntrance[]
}

export const trailheads: Trailhead[] = [
  {
    name: 'Amalga',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.528461, -134.806618',
        milemarker: '27.2',
        notes: 'Just past the bridge over Eagle River. Access to Eagle Glacier cabin',
        source: 'https://www.fs.usda.gov/r10/tongass/recreation/trails/amalga-trail',
        googleMapsUrl: 'https://www.google.com/maps/place/Amalga+Trailhead/@58.5290385,-134.8081391,447m/data=!3m1!1e3!4m6!3m5!1s0x5400fe8062cc1645:0x8758c89a7d45b37c!8m2!3d58.528487!4d-134.8068829!16s%2Fg%2F11bx1ttkz_?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
      }
    ]
  },
  {
    name: 'Mt. Juneau',
    entrances: [
      {
        name: 'Lot Entrance',
        query: '58.308126, -134.386518',
        milemarker: null,
        notes: 'Parking for mining museum with big parking lot',
        source: 'https://www.alaska.org/detail/mount-juneau-trail'
      },
      {
        name: 'Ramp Entrance',
        query: '58.308604, -134.397586',
        milemarker: null,
        notes: 'Early entrance to trail on Basin Road.',
        source: 'https://www.alaska.org/detail/mount-juneau-trail'
      }, 
      {
        name: 'Connection to Perseverance',
        connection: true,
        query: '58.313711, -134.377988',
        milemarker: null,
        notes: 'Maps will take you to Perseverance Trailhead, enter trail from either location and proceed to Mt. Juneau junction.',
        source: 'https://www.alaska.org/detail/mount-juneau-trail'
      }
    ]
  },
  {
    name: 'Mt. Roberts & Gastineau',
    entrances: [
      {
        name: 'Basin Road',
        query: '58.306894, -134.404710',
        milemarker: null,
        notes: null,
        source: 'https://www.alaska.org/detail/perseverance-trail'
      },
      {
        name: 'Tram',
        query: '490 S Franklin St, Juneau, AK 99801',
        milemarker: null,
        notes: 'Pay to ride the tram then follow the trail.',
        source: 'https://www.goldbelttram.com/'
      }
    ]
  },
  { 
    name: 'East Glacier',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.416730, -134.546723',
        notes: 'Starts behind Mendenhall Glacier Visitor Center',
        source: 'https://www.google.com/maps/place/East+Glacier+Trail/@58.4170385,-134.5469128,533m/data=!3m1!1e3!4m14!1m7!3m6!1s0x5400e1e45db43b6b:0xd8dd07c0afeb2107!2sCF83%2BM64,+Juneau,+AK+99801!3b1!8m2!3d58.4166375!4d-134.5469219!3m5!1s0x5400e3c8ad4815c7:0x3528f98cd114686c!8m2!3d58.4152832!4d-134.5422167!16s%2Fg%2F11h1dwc4v6?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
      }
    ]
  },
  {
    name: 'Montana Creek',
    entrances: [
      {
        name: 'Main Entrance',
        query: 'Montana Creek Rd, Juneau, AK 99801',
        milemarker: null,
        notes: 'TODO: confirm exact entrance location, parking, and trailhead situation. Connects to Windfall Creek Trail',
        source: 'https://www.alltrails.com/trail/us/alaska/montana-creek'
      }
    ]
  },
  {
    name: 'Point Bishop - Dupont Dock. (end of Thane Rd.)',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.245394, -134.295743',
        milemarker: null,
        notes: 'Parking in a roundabout.',
        source: 'https://www.alltrails.com/trail/us/alaska/west-glacier-trail'
      }
    ]
  },
  {
    name: 'Point Bridget',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.647399, -134.933613',
        milemarker: '39',
        notes: 'If you cross Cowee bridge you went too far. Access to Cowee Meadow cabin and Blue Mussel Beach cabin',
        source: 'https://www.alltrails.com/trail/us/alaska/point-bridget-trail'
      }
    ]
  },
  {
    name: 'Perseverance',
    entrances: [
      {
        name: 'Lot Entrance',
        query: '58.308126, -134.386518',
        milemarker: null,
        notes: 'Parking for mining museum with big parking lot',
        source: 'https://www.alaska.org/detail/perseverance-trail'
      },
      {
        name: 'Ramp Entrance',
        query: '58.308604, -134.397586',
        milemarker: null,
        notes: 'Early entrance to trail on Basin Road.',
        source: 'https://www.alaska.org/detail/perseverance-trail'
      }
    ]
  },
  {
    name: 'Salmon Creek',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.327179, -134.462792',
        notes: 'Small parking lot located behind warehouse buildings.',
        source: 'google maps',
        googleMapsUrl: 'https://www.google.com/maps/place/Salmon+Creek+Trail/@58.329136,-134.464233,755m/data=!3m1!1e3!4m15!1m8!3m7!1s0x5400dfe2b18cfb2d:0xa5d72783541c2cf4!2sSalmon+Creek-Trail,+Juneau,+AK+99801!3b1!8m2!3d58.336011!4d-134.4347805!16s%2Fg%2F1q5bm0190!3m5!1s0x5400dfdf2bb21aeb:0x38281cd1a6beb82f!8m2!3d58.327312!4d-134.4627985!16s%2Fg%2F11f89x1zs2?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
      }
    ]
  },
  {
    name: 'Spaulding Meadows + Auke Nu',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.386313, -134.655588',
        milemarker: null,
        notes: 'just past Auke Bay from downtown. tiny parking lot',
        source: 'google maps',
        googleMapsUrl: 'https://www.google.com/maps/dir/Downtown+Juneau,+Juneau,+AK+99801/58.38628,-134.65556/@58.386356,-134.6559085,189m/data=!3m1!1e3!4m8!4m7!1m5!1m1!1s0x5400df9d672bcb53:0x3c761885b649bcae!2m2!1d-134.4062488!2d58.2996857!1m0?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
      }
    ]
  },
  {
    name: 'Treadwell Ditch',
    entrances: [
      {
        name: 'Blueberry Hill Entrance',
        query: '58.285780, -134.426751',
        milemarker: null,
        notes: 'Large parking area.',
        source: 'google maps',
        googleMapsUrl: 'https://www.google.com/maps/place/Treadwell+Ditch+Trail+Access/@58.2883053,-134.4339219,1272m/data=!3m1!1e3!4m15!1m8!3m7!1s0x5400de6c6f6a3a8f:0x65ef25aae69f311!2sJuneau,+AK!3b1!8m2!3d58.3004933!4d-134.4201306!16zL20vMGxfcTk!3m5!1s0x540120879bc2c83b:0x5673d8f656595137!8m2!3d58.2855775!4d-134.4266617!16s%2Fg%2F1tj4gqzs?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
      },
      {
        name: 'Eagle Crest Entrance',
        query: '58.285819, -134.528316',
        notes: 'TODO: confirm parking and trail entrance situation',
      },
      {
        name: 'Sandy Beach Entrance',
        query: '58.275740, -134.398308',
        notes: 'Park at Sandy Beach and walk through the neighborhood to the trailhead.',
      }
    ]
  },
  {
    name: 'West Glacier',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.418194, -134.589904',
        milemarker: null,
        notes: 'Trail leads to Skater Cabin and beyond to Mt. Mcginnis',
        source: 'https://www.alltrails.com/trail/us/alaska/west-glacier-trail'
      }
    ]
  },
  {
    name: 'Windfall Creek',
    entrances: [
      {
        name: 'Main Entrance',
        query: '58.523221, -134.793959',
        milemarker: '27',
        notes: 'Small parking area just before Herbert River bridge. Walk down Herbert River Road to trailhead. Trail leads to Windfall Cabin and continues beyond to Montana Creek Trail.',
        source: 'https://www.alaska.org/detail/windfall-lake-trail'
      }
    ]
  }
]
