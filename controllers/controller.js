require('dotenv').config();
const axios = require('axios');

const owmApiKey = process.env.OPENWEATHERMAP_API_KEY;
const spotifyApiKey = process.env.SPOTIFY_API_KEY;
const spotifyApiSecret = process.env.SPOTIFY_API_SECRET;
const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

let lat;
let lon;
let name;
let genre;
let weatherCode;
let weatherData;

const lang = 'kr' //언어
const units = 'metric' //섭씨
const headers = {
    'Authorization': `KakaoAK ${kakaoRestApiKey}`,
};

const kakaoMapUrl = () => `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`
const currentPositionWeatherApiUrl = () => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&
                                                lang=${lang}&units=${units}&appid=${owmApiKey}`;

const controller ={
    index: (req,res) => {
        res.render('index');
    },

    getCurrentPositionWeather: (req, res) => {
        lat = req.body.lat;
        lon = req.body.lon;

        axios.get(kakaoMapUrl(),{
            headers: headers,
        })
            .then(response => {
                name = response.data.documents[0].address_name;
        })
            .catch(error => {
                console.error(error);
            });

        axios.get(currentPositionWeatherApiUrl())
            .then(response => {
                // 주어진 날씨 코드
                weatherCode = response.data.weather[0].id;
                const weatherIcon = 'https://openweathermap.org/img/wn/'+ response.data.weather[0].icon + '@2x.png';
                // 날씨 코드에 대한 한글 설명 찾기
                const weatherDescObj = weatherDescKo.find(item => Object.keys(item)[0] == weatherCode);
                // 찾은 설명이 있다면 해당 값을 가져오고, 없다면 기본 메시지 표시
                const weatherDescKorean = weatherDescObj ? Object.values(weatherDescObj)[0] : '알 수 없는 날씨';

                weatherData = {
                    city : name,
                    temp : response.data.main.temp,
                    feels_temp : response.data.main.feels_like,
                    temp_min : response.data.main.temp_min,
                    temp_max: response.data.main.temp_max,
                    humidity: response.data.main.humidity,
                    wind_speed: response.data.wind.speed,
                    weatherInfo : weatherDescKorean,
                    weatherIcon : weatherIcon
                };
                console.log('Weather Data:', weatherData);
                res.json(weatherData);
                // 여기에서 날씨 정보를 가지고 원하는 작업을 수행하세요
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    },
}

const weatherDescKo = [
    { 201: '가벼운 비를 동반한 천둥구름' },
    { 200: '비를 동반한 천둥구름' },
    { 202: '폭우를 동반한 천둥구름' },
    { 210: '약한 천둥구름' },
    { 211: '천둥구름' },
    { 212: '강한 천둥구름' },
    { 221: '불규칙적 천둥구름' },
    { 230: '약한 연무를 동반한 천둥구름' },
    { 231: '연무를 동반한 천둥구름' },
    { 232: '강한 안개비를 동반한 천둥구름' },
    { 300: '가벼운 안개비' },
    { 301: '안개비' },
    { 302: '강한 안개비' },
    { 310: '가벼운 적은비' },
    { 311: '적은비' },
    { 312: '강한 적은비' },
    { 313: '소나기와 안개비' },
    { 314: '강한 소나기와 안개비' },
    { 321: '소나기' },
    { 500: '악한 비' },
    { 501: '중간 비' },
    { 502: '강한 비' },
    { 503: '매우 강한 비' },
    { 504: '극심한 비' },
    { 511: '우박' },
    { 520: '약한 소나기 비' },
    { 521: '소나기 비' },
    { 522: '강한 소나기 비' },
    { 531: '불규칙적 소나기 비' },
    { 600: '가벼운 눈' },
    { 601: '눈' },
    { 602: '강한 눈' },
    { 611: '진눈깨비' },
    { 612: '소나기 진눈깨비' },
    { 615: '약한 비와 눈' },
    { 616: '비와 눈' },
    { 620: '약한 소나기 눈' },
    { 621: '소나기 눈' },
    { 622: '강한 소나기 눈' },
    { 701: '박무' },
    { 711: '연기' },
    { 721: '연무' },
    { 731: '모래 먼지' },
    { 741: '안개' },
    { 751: '모래' },
    { 761: '먼지' },
    { 762: '화산재' },
    { 771: '돌풍' },
    { 781: '토네이도' },
    { 800: '구름 한 점 없는 맑은 하늘' },
    { 801: '약간의 구름이 낀 하늘' },
    { 802: '드문드문 구름이 낀 하늘' },
    { 803: '구름이 거의 없는 하늘' },
    { 804: '구름으로 뒤덮인 흐린 하늘' },
    { 900: '토네이도' },
    { 901: '태풍' },
    { 902: '허리케인' },
    { 903: '한랭' },
    { 904: '고온' },
    { 905: '바람부는' },
    { 906: '우박' },
    { 951: '바람이 거의 없는' },
    { 952: '약한 바람' },
    { 953: '부드러운 바람' },
    { 954: '중간 세기 바람' },
    { 955: '신선한 바람' },
    { 956: '센 바람' },
    { 957: '돌풍에 가까운 센 바람' },
    { 958: '돌풍' },
    { 959: '심각한 돌풍' },
    { 960: '폭풍' },
    { 961: '강한 폭풍' },
    { 962: '허리케인' },
]

const weatherGenres = [
    { 201: 'Ballad' },
    { 200: 'Jazz' },
    { 202: 'Rock' },
    { 210: 'Blues' },
    { 211: 'Rock' },
    { 212: 'Rock' },
    { 221: 'Blues' },
    { 230: 'Acoustic' },
    { 231: 'Blues' },
    { 232: 'Metal' },
    { 300: 'Ballad' },
    { 301: 'Ballad' },
    { 302: 'Jazz' },
    { 310: 'Ballad' },
    { 311: 'Ballad' },
    { 312: 'Jazz' },
    { 313: 'Acoustic' },
    { 314: 'Metal' },
    { 321: 'Jazz' },
    { 500: 'Acoustic' },
    { 501: 'Jazz' },
    { 502: 'Metal' },
    { 503: 'Rock' },
    { 504: 'Metal' },
    { 511: 'Rock' },
    { 520: 'Acoustic' },
    { 521: 'Jazz' },
    { 522: 'Metal' },
    { 531: 'Jazz' },
    { 600: 'Carol' },
    { 601: 'Carol' },
    { 602: 'Carol' },
    { 611: 'Carol' },
    { 612: 'Ballad' },
    { 615: 'Ballad' },
    { 616: 'Jazz' },
    { 620: 'Ballad' },
    { 621: 'Ballad' },
    { 622: 'Carol' },
    { 701: 'Carol' },
    { 711: 'Acoustic' },
    { 721: 'Acoustic' },
    { 731: 'Tropical' },
    { 741: 'Pop' },
    { 751: 'Tropical' },
    { 761: 'Tropical' },
    { 762: 'Tropical' },
    { 771: 'Metal' },
    { 781: 'Metal' },
    { 800: 'Pop' },
    { 801: 'Pop' },
    { 802: 'Pop' },
    { 803: 'Pop' },
    { 804: 'Ballad' },
    { 900: 'Metal' },
    { 901: 'Metal' },
    { 902: 'Metal' },
    { 903: 'Carol' },
    { 904: 'Tropical' },
    { 905: 'Electronica' },
    { 906: 'Rock' },
    { 951: 'Electronica' },
    { 952: 'Acoustic' },
    { 953: 'Acoustic' },
    { 954: 'Rock' },
    { 955: 'Acoustic' },
    { 956: 'Rock' },
    { 957: 'Metal' },
    { 958: 'Metal' },
    { 959: 'Metal' },
    { 960: 'Metal' },
    { 961: 'Rock' },
    { 962: 'Rock' },
]

module.exports = {controller};