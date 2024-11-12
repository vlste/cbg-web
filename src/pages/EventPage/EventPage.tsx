import { PurchasedGiftResponse } from "@/api/api";
import { Img } from "@/components/img/Img";
import { Lottie } from "@/components/lottie/Lottie";
import { Page } from "@/components/page/Page";
import { publicUrl } from "@/helpers/publicUrl";
import { useTabbar } from "@/hooks/useTabbar";
import { mainButton, secondaryButton } from "@telegram-apps/sdk-react";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface AlertProps {
  visible: boolean;
  icon?: string;
  title?: string;
  description?: string;
  button?: {
    text: string;
    onClick: () => void;
  };
}

const Alert: FC<AlertProps> = (
  { visible, icon, title, description, button },
) => {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 px-4 py-2 bg-bg-notification dark:bg-black/80 rounded-[14px] shadow-lg"
    >
      <div className="flex items-center gap-2">
        {icon && <Img src={icon} alt="icon" className="w-[28px] h-[28px]" />}
        <div className="flex flex-col flex-1">
          {title && (
            <h3 className="text-[14px] font-[590] text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[14px] font-[400] text-white">
              {description}
            </p>
          )}
        </div>
        {button && (
          <button
            onClick={button.onClick}
            className="text-accent-cyan text=[17px] font-[400]"
          >
            {button.text}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const EventPage: FC = () => {
  const { t } = useTranslation();
  const { show, hide } = useTabbar();
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event as {
    type: "purchased" | "received";
    gift: PurchasedGiftResponse;
    price?: {
      amount: number;
      token: string;
    };
  };

  useEffect(() => {
    hide();

    const mainButtonTap = () => {
      mainButton.setParams({
        isVisible: false,
      });
      secondaryButton.setParams({
        isVisible: false,
      });
      if (event.type === "purchased") {
        navigate("/gifts");
      } else {
        navigate("/profile");
      }
    };

    const secondaryButtonTap = () => {
      mainButton.setParams({
        isVisible: false,
      });
      secondaryButton.setParams({
        isVisible: false,
      });
      navigate("/store");
    };

    mainButton.onClick(mainButtonTap);
    secondaryButton.onClick(secondaryButtonTap);

    mainButton.setParams({
      isVisible: true,
      text: t(`event.buttons.primary.${event.type}`),
    });

    secondaryButton.setParams({
      position: "bottom",
      isVisible: event.type === "purchased",
      text: t(`event.buttons.secondary.${event.type}`),
    });

    return () => {
      mainButton.offClick(mainButtonTap);
      secondaryButton.offClick(secondaryButtonTap);
    };
  }, []);

  return (
    <Page back={false}>
      <div className="flex flex-col h-full justify-center items-center animate-in-page">
        <div className="relative animate-in-lottie">
          {event.type === "purchased" && (
            <Lottie
              src={publicUrl(`lotties/bought.lottie`)}
              autoplay={true}
              loop={false}
              style={{
                width: 200,
                height: 200,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          <Lottie
            src={publicUrl(`lotties/${event.gift.slug}.lottie`)}
            autoplay={true}
            style={{ width: 100, height: 100 }}
          />
        </div>
        <h1 className="text-[24px] font-[600] text-black dark:text-white mt-4">
          {event.type === "purchased"
            ? t("event.purchased")
            : t("event.received")}
        </h1>
        <p className="text-[17px] text-black dark:text-white font-[400] mt-2">
          {event.type === "purchased"
            ? (
              <Trans
                i18nKey="event.purchasedDescription"
                values={{
                  gift: event.gift.name,
                  price: event.price?.amount,
                  token: event.price?.token,
                }}
                components={{
                  bold: <span className="font-[500]" />,
                }}
              />
            )
            : (
              <Trans
                i18nKey="event.receivedDescription"
                values={{
                  gift: event.gift.name,
                }}
                components={{
                  bold: <span className="font-[500]" />,
                }}
              />
            )}
        </p>
      </div>
      <AnimatePresence>
        <Alert
          visible={true}
          icon={publicUrl(`thumbnail/${event.gift.slug}.png`)}
          title={t(`notification.${event.type}.title`, {
            gift: event.gift.name,
            sender: event.gift.buyer?.firstName,
          })}
          description={t(`notification.${event.type}.description`, {
            gift: event.gift.name,
            sender: event.gift.buyer?.firstName,
          })}
          button={{
            text: t(`notification.${event.type}.button`),
            onClick: () => {
              mainButton.setParams({
                isVisible: false,
              });
              secondaryButton.setParams({
                isVisible: false,
              });
              if (event.type === "purchased") {
                navigate("/gifts");
              } else {
                navigate("/profile");
              }
            },
          }}
        />
      </AnimatePresence>
    </Page>
  );
};
