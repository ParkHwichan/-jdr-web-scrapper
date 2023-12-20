const {isHttpUrl} = require("./isValidUrl");

const isImageUrl = (url) => {
    // HTTP 또는 HTTPS URL인지 확인
    if(typeof url !== 'string') {
        return false;
    }

    if(url.startsWith('//')) {
        url = 'https:' + url;
    }

    if (!isHttpUrl(url)) {
        return false;
    }

    try {
        // URL 객체를 사용하여 분석
        const parsedUrl = new URL(url);

        // 파일 확장자 추출
        const pathname = parsedUrl.pathname;
        const extension = pathname.split('.').pop().toLowerCase();

        // 지원되는 이미지 확장자 체크
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
        return validExtensions.includes(extension);
    } catch (error) {
        // URL 구문 분석 중 오류 발생 시
        console.error('Error parsing the URL:', error);
        return false;
    }
};

module.exports = isImageUrl;
