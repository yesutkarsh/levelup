import Sidepanel from '@/components/SidePanel/Sidepanel'
import React from 'react'

// Importing type
import { Notification } from '@/components/SidePanel/Sidepanel'
const dummyNotifications:Notification[] = [
  {
    id:1,
    title:"Industry Expose Sessions with Deepinder Goyal",
    description:"CEO ZOMATO",
    date:"Date",
    link:"Link"
  },
  {
    id:2,
    title:"Title",
    description:"Description",
    date:"Date",
    link:"Link"
  },
  {
    id:3,
    title:"Title",
    description:"Description",
    date:"Date",
    link:"Link"
  }
]

export default function page():React.ReactElement{
  return (
    <Sidepanel event={1} news={2} updates={3} weekTrends={4} notifications={dummyNotifications}/>
  )
};
