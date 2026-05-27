express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors()); // 브라우저에서 서버로 요청 허용

const CLIENT_ID = "ibiRimg_6cVejcKtPwbf";
const CLIENT_SECRET = "neZcOL0cJB";

export default async function handler(req, res) {
  const { query } = req.query;

  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/local.json",
      {
        params: { query, display: 10, start: 1, sort: "comment" },
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
        },
      },
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/local.json",
      {
        params: {
          query: query,
          display: 10, // 10개 출력
          start: 1,
          sort: "comment", // 별점/리뷰 순 (정확도)
        },
        headers: {
          "X-Naver-Client-Id": CLIENT_ID,
          "X-Naver-Client-Secret": CLIENT_SECRET,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("서버가 3000번 포트에서 실행 중!"));

function displayStoreMarkers(items) {
  const listEl = document.getElementById("store-list");
  listEl.innerHTML = ""; // 이전 목록 비우기

  storeMarkers.forEach((marker) => marker.setMap(null));
  storeMarkers = [];

  items.forEach((item, index) => {
    const tm128 = new naver.maps.Point(Number(item.mapx), Number(item.mapy));
    const latlng = naver.maps.TransCoord.fromTM128ToLatLng(tm128);
    const title = item.title.replace(/<[^>]*>?/gm, "");

    // 1. 지도 마커 생성
    const marker = new naver.maps.Marker({
      position: latlng,
      map: map,
      title: title,
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: `<div style="padding:10px;"><strong>${title}</strong></div>`,
    });

    // 2. 오른쪽 목록 블록 생성
    const listItem = document.createElement("li");
    listItem.className = "store-item";
    listItem.innerHTML = `
            <strong>${title}</strong>
            <span>${item.address}</span>
        `;

    // 3. 목록 클릭 이벤트 (지도가 해당 위치로 이동)
    listItem.onclick = () => {
      // 모든 목록에서 active 클래스 제거 후 현재 항목에만 추가
      document
        .querySelectorAll(".store-item")
        .forEach((li) => li.classList.remove("active"));
      listItem.classList.add("active");

      // 지도 중심 이동 및 정보창 열기
      map.panTo(latlng);
      infoWindow.open(map, marker);
    };

    // 4. 마커 클릭 이벤트 (목록과 연동)
    naver.maps.Event.addListener(marker, "click", () => {
      listItem.click(); // 마커 클릭 시 목록 클릭 효과와 동일하게 작동
    });

    listEl.appendChild(listItem);
    storeMarkers.push(marker);
  });
}
