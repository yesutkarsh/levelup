import React, { JSX } from "react";
import styles from "./styles.module.css";

export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  link: string;
}

interface SidepanelProps {
  event: number;
  news: number;
  updates: number;
  weekTrends: number;
  notifications: Notification[];
}

export default function Sidepanel({
  event,
  news,
  updates,
  weekTrends,
  notifications,
}: SidepanelProps): JSX.Element {
  return (
    <div className={styles.sidepanel}>
      <div className={styles.sidepanelheader}>
        {/* Numbers of Updates, News, Events, etc */}
        <div className={styles.sidepanelheadernumbers}>
          <div>
            <h1>
              <i className="ri-bookmark-fill"></i>  Event
            </h1>
            <span>{event}</span>
          </div>
          <div>
            <h1>
              <i className="ri-newspaper-line"></i>  News
            </h1>
            <span>{news}</span>
          </div>
          <div>
            <h1>
              <i className="ri-calendar-event-fill"></i>  Updates
            </h1>
            <span>{updates}</span>
          </div>
          <div>
            <h1>
            <i className="ri-at-line"></i>  Trends
            </h1>
            <span>{weekTrends}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <div key={notification.id} className={styles.notification}>
          <h1>{notification.title}</h1>
          <p>{notification.description}</p>
          <a href={notification.link}>
            Read More <i className="ri-arrow-right-line"></i>
          </a>
        </div>
      ))}
    </div>
  );
}