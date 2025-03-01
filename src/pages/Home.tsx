import {
  IonContent,
  IonPage,
  IonSpinner,
} from "@ionic/react";
import "./Home.css";
import { useEffect, useState } from "react";
import { Device } from "@capacitor/device";

const Home: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isPlugged, setIsPlugged] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBatteryStatus = async () => {
      try {
        const info = await Device.getBatteryInfo();
        setBatteryLevel(info.batteryLevel ? info.batteryLevel * 100 : -1);
        setIsPlugged(info.isCharging !== undefined ? info.isCharging : null);
      } catch (error) {
        console.error("Error getting battery info:", error);
        setBatteryLevel(-1);
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(getBatteryStatus, 5000);

    getBatteryStatus();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container">
          {isLoading ? (
            <>
              <IonSpinner />
              <p style={{ marginLeft: "10px" }}>
                Loading Battery Information...
              </p>
            </>
          ) : batteryLevel !== null ? (
            <>
              {batteryLevel === -1 ? (
                <p>Battery info not available in browser or error occurred.</p>
              ) : (
                <>
                  <p>Battery Level: {batteryLevel}%</p>
                  <p>
                    <span className="emoji">{isPlugged ? "🔌" : "🔋"}</span>
                  </p>
                </>
              )}
            </>
          ) : (
            <p>Error Loading Battery Information</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
