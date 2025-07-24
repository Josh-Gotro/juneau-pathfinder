export interface Trailhead {
  name: string
  query: string
  milemarker?: string
  notes?: string
  source?: string
}

export const trailheads: Trailhead[] = [
  {
    name: 'Mt. Juneau (Yadaa Kalé) Trailhead',
    query: 'Perseverance Trail, Juneau, AK 99801',
    milemarker: 'MM 3.5',
    notes: 'Park at the Perseverance Trail parking area',
    source: 'https://www.alltrails.com/trail/us/alaska/mt-juneau-yadaa-kale-trailhead'
  },
  {
    name: 'Perseverance Trailhead',
    query: 'Perseverance Trail, Juneau, AK 99801',
    milemarker: 'MM 3.5',
    notes: 'Main trailhead for Perseverance Trail',
    source: 'https://www.alltrails.com/trail/us/alaska/perseverance-trailhead'
  },
  {
    name: 'Gold Creek Flume East Trailhead',
    query: '921 Basin Rd, Juneau, AK 99801',
    milemarker: 'MM 2.8',
    notes: 'Access via Basin Road, look for the flume',
    source: 'https://www.alltrails.com/trail/us/alaska/gold-creek-flume-east-trailhead'
  },
  {
    name: 'Gold Creek Flume West Trailhead',
    query: '1684 Evergreen Ave, Juneau, AK 99801',
    milemarker: 'MM 2.1',
    notes: 'Western access point to the flume trail',
    source: 'https://www.alltrails.com/trail/us/alaska/gold-creek-flume-west-trailhead'
  },
  {
    name: 'Mount Roberts Trailhead',
    query: '1001 Basin Rd, Juneau, AK 99801',
    milemarker: 'MM 2.9',
    notes: 'Trailhead near the Basin Road junction',
    source: 'https://www.alltrails.com/trail/us/alaska/mount-roberts-trailhead-basin-rd'
  },
  {
    name: 'Eaglecrest Ski Area',
    query: '3000 Fish Creek Rd, Juneau, AK 99801',
    milemarker: 'MM 15.2',
    notes: 'Summer hiking trails available',
    source: 'https://www.alltrails.com/trail/us/alaska/eaglecrest-ski-area'
  },
  {
    name: 'West Glacier Trail',
    query: 'West Glacier Trail, Juneau, AK 99801',
    milemarker: 'MM 12.8',
    notes: 'Access to Mendenhall Glacier from the west',
    source: 'https://www.alltrails.com/trail/us/alaska/west-glacier-trail'
  },
  {
    name: 'East Glacier Trail',
    query: 'East Glacier Trail, Juneau, AK 99801',
    milemarker: 'MM 13.1',
    notes: 'Alternative route to Mendenhall Glacier',
    source: 'https://www.alltrails.com/trail/us/alaska/east-glacier-trail'
  },
  {
    name: 'Herbert Glacier Trail',
    query: 'Herbert Glacier Trail, Juneau, AK 99801',
    milemarker: 'MM 28.3',
    notes: 'Remote glacier access, 4WD recommended',
    source: 'https://www.alltrails.com/trail/us/alaska/herbert-glacier-trail'
  },
  {
    name: 'Treadwell Ditch Trail',
    query: 'Treadwell Ditch Trail, Juneau, AK 99801',
    milemarker: 'MM 4.2',
    notes: 'Historic mining trail with great views',
    source: 'https://www.alltrails.com/trail/us/alaska/treadwell-ditch-trail'
  }
]
