export default class StoreStorage {
    saveAppState(state) {
        localStorage.setItem('app_state', JSON.stringify(state));
    }

    loadAppState() {
        const data = localStorage.getItem('app_state');

        return data ? JSON.parse(data) : {};
    }
}
