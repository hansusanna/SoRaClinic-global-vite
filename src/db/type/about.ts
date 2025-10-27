export type Doctor = { name: string; role: string; image: string }
export type TimelineItem = { year: string; title: string; description: string }

export type AboutPageData = {
  header: {
    title: { part1: string; part2: string; part3: string }
    subtitle: string
  }
  timeline: { title: string; items: TimelineItem[] }
  doctors: { title?: string; items: Doctor[] }
  mission: {
    title: string
    description: string
    points: { title: string; description: string }[]
  }
}
