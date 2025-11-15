// Service xử lý geolocation

export function getUserLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
        console.warn('Trình duyệt không hỗ trợ Geolocation');
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            onSuccess({ lat, lng });
        },
        (error) => {
            const errorMessage = getGeolocationErrorMessage(error.code);
            console.error('Geolocation error:', error.code, error.message);
            console.warn(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
        },
        options
    );
}

function getGeolocationErrorMessage(errorCode) {
    switch(errorCode) {
        case 1: // PERMISSION_DENIED
            return 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cấp quyền trong cài đặt trình duyệt.';
        case 2: // POSITION_UNAVAILABLE
            return 'Thông tin vị trí không khả dụng. Vui lòng kiểm tra GPS/Location Services.';
        case 3: // TIMEOUT
            return 'Yêu cầu lấy vị trí đã hết thời gian. Vui lòng thử lại.';
        default:
            return 'Không thể lấy vị trí của bạn. Lỗi không xác định.';
    }
}
