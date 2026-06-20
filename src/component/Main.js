import CloudIcon from "@mui/icons-material/Cloud";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import "moment/min/locales";

export default function Main() {
  const date = moment().format("LL");
  const { t, i18n } = useTranslation();
  const [tempData, setTempData] = useState({});
  const currentLang = i18n.language;
  currentLang === "ar" ? moment.locale("ar") : moment.locale("en");
  useEffect(() => {
    let cancel;
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=33.5104&lon=36.2783&appid=56f06e8e90193909a7d15d120438c94d",
        { cancelToken: new axios.CancelToken((c) => (cancel = c)) },
      )
      .then((response) => {
        const { temp, temp_max, temp_min } = response.data.main;
        const { description, icon } = response.data.weather[0];
        setTempData({
          temp: Math.round(temp - 272.15),
          temp_max: Math.round(temp_max - 272.15),
          temp_min: Math.round(temp_min - 272.15),
          description,
          icon: `https://openweathermap.org/payload/api/media/file/${icon}.png`,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        console.error("Error fetching weather data:", error);
      });
    return () => cancel();
  }, []);

  return (
    <div style={{ direction: currentLang === "ar" ? "rtl" : "ltr" }}>
      <div className="container">
        <div className="title">
          <h1
            style={{
              margin: currentLang === "ar" ? "0 0 0 20px" : "0 20px 0 0",
            }}
          >
            {t("Damascus")}
          </h1>
          <p>{date}</p>
        </div>
        <hr />
        <div className="content">
          <div className="details">
            <div>
              <h1>
                {tempData.temp}
                <sup>°</sup>
              </h1>
              <img src={tempData.icon} alt={tempData.description} />
            </div>
            <p>{t(tempData.description)}</p>
            <div>
              <p>
                {t("min")}: <span>°{tempData.temp_min}</span>
              </p>
              <p className="sep">|</p>
              <p>
                {t("max")}: <span>°{tempData.temp_max}</span>
              </p>
            </div>
          </div>
          <CloudIcon sx={{ fontSize: "clamp(100px, 30vw, 200px)" }} />
        </div>
      </div>
      <div className="btn">
        <button onClick={handleTranslate}>{t("Arabic")}</button>
      </div>
    </div>
  );

  function handleTranslate() {
    const newLang = currentLang === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  }
}
