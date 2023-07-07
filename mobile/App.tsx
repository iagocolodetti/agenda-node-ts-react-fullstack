import { StatusBar } from 'expo-status-bar';

import Routes from './src/routes';

export default function App() {
    return (
        <>
            <StatusBar style="light" backgroundColor="#3c3c3c" />
            <Routes />
        </>
    );
}
