export interface Trailhead {
  name: string
  query: string
  milemarker?: string | null
  notes?: string | null
  source?: string | null
  googleMapsUrl?: string | null
}

export const trailheads: Trailhead[] = [
    {
    name: 'Amalga Trail',
    query: 'G5HV+96 Dobson Landing, Juneau, AK',
    milemarker: '27.2',
    notes: 'Just past the bridge over Eagle River.Access to Eagle Glacier cabin',
    source: 'https://www.fs.usda.gov/r10/tongass/recreation/trails/amalga-trail',
    googleMapsUrl: 'https://www.google.com/maps/place/Amalga+Trailhead/@58.5290385,-134.8081391,447m/data=!3m1!1e3!4m6!3m5!1s0x5400fe8062cc1645:0x8758c89a7d45b37c!8m2!3d58.528487!4d-134.8068829!16s%2Fg%2F11bx1ttkz_?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    name: 'Mt. Juneau (Yadaa Kalé) Trailhead',
    query: 'Perseverance Trail, Juneau, AK 99801',
    milemarker: null,
    notes: 'Park at the Perseverance Trail parking area',
    source: 'https://www.alltrails.com/trail/us/alaska/mt-juneau-yadaa-kale-trailhead'
  },
  {
    name: 'Mount Roberts Trailhead',
    query: '1001 Basin Rd, Juneau, AK 99801',
    milemarker: 'MM 2.9',
    notes: 'Trailhead near the Basin Road junction',
    source: 'https://www.alltrails.com/trail/us/alaska/mount-roberts-trailhead-basin-rd'
  },
  {
    name: 'East Glacier Trail',
    query: 'CF83+M64 Mendenhall Valley, Juneau, AK',
    notes: 'Starts behind Mendenhall Glacier Visitor Center',
    source: 'https://www.google.com/maps/place/East+Glacier+Trail/@58.4170385,-134.5469128,533m/data=!3m1!1e3!4m14!1m7!3m6!1s0x5400e1e45db43b6b:0xd8dd07c0afeb2107!2sCF83%2BM64,+Juneau,+AK+99801!3b1!8m2!3d58.4166375!4d-134.5469219!3m5!1s0x5400e3c8ad4815c7:0x3528f98cd114686c!8m2!3d58.4152832!4d-134.5422167!16s%2Fg%2F11h1dwc4v6?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    name: 'Point Bridget Trail',
    query: '94C7J3W8+XG',
    milemarker: '39',
    notes: 'If you cross Cowee bridge you went too far. \n Access to Cowee Meadow cabin and Blue Mussel Beach cabin',
    source: 'https://www.alltrails.com/trail/us/alaska/point-bridget-trail'
  },
  {
    name: 'Perseverance Trailhead',
    query: '8J57+69 Downtown Juneau, Juneau, AK',
    milemarker: 'MM 3.5',
    notes: 'Main trailhead for Perseverance Trail',
    source: 'https://www.alltrails.com/trail/us/alaska/perseverance-trailhead'
  },
  {
    name: 'Salmon Creek Trail',
    query: '8GGP+WV Twin Lakes, Juneau, AK',
    notes: 'Small Parking area',
    source: 'google maps',
    googleMapsUrl: 'https://www.google.com/maps/place/Salmon+Creek+Trail/@58.329136,-134.464233,755m/data=!3m1!1e3!4m15!1m8!3m7!1s0x5400dfe2b18cfb2d:0xa5d72783541c2cf4!2sSalmon+Creek+Trail,+Juneau,+AK+99801!3b1!8m2!3d58.336011!4d-134.4347805!16s%2Fg%2F1q5bm0190!3m5!1s0x5400dfdf2bb21aeb:0x38281cd1a6beb82f!8m2!3d58.327312!4d-134.4627985!16s%2Fg%2F11f89x1zs2?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    name: 'Spaulding Meadows + Auke Nu Trail',
    query: '12144-12166 Glacier Hwy, Juneau, AK 99801',
    milemarker: null,
    notes: 'just past Auke Bay from downtown. tiny parking lot',
    source: 'google maps',
    googleMapsUrl: 'https://www.google.com/maps/dir/Downtown+Juneau,+Juneau,+AK+99801/58.38628,-134.65556/@58.386356,-134.6559085,189m/data=!3m1!1e3!4m8!4m7!1m5!1m1!1s0x5400df9d672bcb53:0x3c761885b649bcae!2m2!1d-134.4062488!2d58.2996857!1m0?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    name: 'Treadwell Ditch - Blueberry Hill entrance',
    query: '7HPF+68 West Juneau, Juneau, AK',
    milemarker: null,
    notes: 'Large parking area.',
    source: 'google maps',
    googleMapsUrl: 'https://www.google.com/maps/place/Treadwell+Ditch+Trail+Access/@58.2883053,-134.4339219,1272m/data=!3m1!1e3!4m15!1m8!3m7!1s0x5400de6c6f6a3a8f:0x65ef25aae69f311!2sJuneau,+AK!3b1!8m2!3d58.3004933!4d-134.4201306!16zL20vMGxfcTk!3m5!1s0x540120879bc2c83b:0x5673d8f656595137!8m2!3d58.2855775!4d-134.4266617!16s%2Fg%2F1tj4gqzs?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    name: 'Treadwell Ditch - Sandy Beach entrance',
    query: '7JG2+7MR Douglas, Juneau, AK',
    notes: 'Park at Sandy Beach and walk through the neighborhood to the trailhead.',
  },
  {
    name: 'West Glacier Trail',
    query: 'CC96+92 Back Loop, Juneau, AK',
    milemarker: null,
    notes: 'Connects to Mt. Mcginnis Trailhead',
    source: 'https://www.alltrails.com/trail/us/alaska/west-glacier-trail'
  }
]
