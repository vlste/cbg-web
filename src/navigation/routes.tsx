import type { ComponentType, JSX } from "react";

import { StorePage } from "@/pages/StorePage/StorePage";
import { GiftsPage } from "@/pages/GiftsPage/GiftsPage";
import { LeaderboardPage } from "@/pages/LeadeboardPage/LeaderboardPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { RecentActionsPage } from "@/pages/ProfilePage/RecentActionsPage/RecentActionsPage";
import { EventPage } from "@/pages/EventPage/EventPage";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: "/store", Component: StorePage },
  { path: "/gifts", Component: GiftsPage },
  { path: "/leaderboard", Component: LeaderboardPage },
  { path: "/profile", Component: ProfilePage },
  { path: "/profile/recent-actions", Component: RecentActionsPage },
  { path: "/event", Component: EventPage },
];
