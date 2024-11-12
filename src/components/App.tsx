import {
  hapticFeedback,
  miniApp,
  useLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";

import { routes } from "@/navigation/routes.tsx";
import { Tabbar } from "@/components/Layout/Tabbar/Tabbar";
import { GiftBuyPage } from "@/pages/StorePage/GiftBuyPage/GiftBuyPage";
import { StoreSVG } from "./icons/tabs/StoreTabIcon";
import { GiftsSVG } from "./icons/tabs/GiftsTabIcon";
import { LeaderboardSVG } from "./icons/tabs/LeaderboardTabIcon";
import { ProfileSVG } from "./icons/tabs/ProfileTabIcon";
import { LeaderboardProfilePage } from "@/pages/LeadeboardPage/LeaderboardProfilePage/LeaderboardProfilePage";
import { useAppStore } from "@/stores/appStore";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/api";

// Add this type to track tab history
type TabHistory = {
  store: string;
  gifts: string;
  leaderboard: string;
  profile: string;
};

function Layout(_: { dark: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tabHistory = useRef<TabHistory>({
    store: "/store",
    gifts: "/gifts",
    leaderboard: "/leaderboard",
    profile: "/profile",
  });

  useEffect(() => {
    const currentTab = getCurrentTab(location.pathname);
    if (currentTab) {
      tabHistory.current[currentTab] = location.pathname;
    }
  }, [location.pathname]);

  const getCurrentTab = (path: string): keyof TabHistory | null => {
    if (path.startsWith("/store")) return "store";
    if (path.startsWith("/gifts")) return "gifts";
    if (path.startsWith("/leaderboard")) return "leaderboard";
    if (path.startsWith("/profile")) return "profile";
    return null;
  };

  const handleTabClick = (tab: keyof TabHistory) => {
    hapticFeedback.selectionChanged();
    // navigate(tabHistory.current[tab], {
    //   state: { tab: true },
    //   replace: true,
    // });
    const rootPath = `/${tab}`;
    tabHistory.current[tab] = rootPath;
    navigate(rootPath, { replace: true });
  };

  const handleTabDoubleTap = (tab: keyof TabHistory) => {
    const rootPath = `/${tab}`;
    tabHistory.current[tab] = rootPath;
    navigate(rootPath);
  };

  const currentTab = getCurrentTab(location.pathname);

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/store/gifts/:id"
          Component={GiftBuyPage}
        />
        <Route
          path="/leaderboard/profile/:id"
          Component={LeaderboardProfilePage}
        />
        {routes.map((route) => <Route key={route.path} {...route} />)}
        <Route path="*" element={<Navigate to="/store" replace />} />
      </Routes>
      <Tabbar>
        <Tabbar.Item
          onClick={() => handleTabClick("store")}
          onDoubleTap={() => handleTabDoubleTap("store")}
          selected={currentTab === "store" ||
            location.pathname === "/" ||
            location.pathname === "/store"}
          lottieIconFileName="tab-store-selected.lottie"
          text={t("tabs.store")}
        >
          <StoreSVG />
        </Tabbar.Item>
        <Tabbar.Item
          onClick={() => handleTabClick("gifts")}
          onDoubleTap={() => handleTabDoubleTap("gifts")}
          selected={currentTab === "gifts"}
          lottieIconFileName="tab-gifts-selected.lottie"
          text={t("tabs.gifts")}
        >
          <GiftsSVG />
        </Tabbar.Item>
        <Tabbar.Item
          onClick={() => handleTabClick("leaderboard")}
          onDoubleTap={() => handleTabDoubleTap("leaderboard")}
          selected={currentTab === "leaderboard"}
          lottieIconFileName="tab-leaderboard-selected.lottie"
          text={t("tabs.leaderboard")}
        >
          <LeaderboardSVG />
        </Tabbar.Item>
        <Tabbar.Item
          onClick={() => handleTabClick("profile")}
          onDoubleTap={() => handleTabDoubleTap("profile")}
          selected={currentTab === "profile"}
          lottieIconFileName="tab-profile-selected.lottie"
          text={t("tabs.profile")}
        >
          <ProfileSVG />
        </Tabbar.Item>
      </Tabbar>
    </>
  );
}

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const { initData, setProfile } = useAppStore();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      console.log("Fetching profile");
      const userId = initData?.user?.id;
      if (!userId) return null;
      return API.getProfile(userId.toString());
    },
    enabled: !!initData?.user?.id,
  });

  useEffect(() => {
    const receive = async (token: string) => {
      if (!lp.initData?.user?.id || !lp.initDataRaw) return;
      try {
        API.setInitDataHeader(lp.initDataRaw);
        const profile = await API.getProfile(lp.initData.user.id.toString());
        const response = await API.receiveGift(token);

        if (response.status === 200 && response.data.success) {
          navigate("/event", {
            state: {
              event: {
                type: "received",
                gift: response.data.gift,
              },
            },
          });
        }
      } catch (error) {
        console.error("Failed to receive gift:", error);
      }
    };

    if (lp.startParam) {
      if (lp.startParam.startsWith("receive-")) {
        const split = lp.startParam.split("-");
        if (split.length > 1) {
          receive(split[1]);
        }
      }
    }
  }, [lp.startParam, lp.initData]);

  useEffect(() => {
    if (profile) {
      setProfile(profile.data);
    }
  }, [profile]);

  return <Layout dark={isDark} />;
}
