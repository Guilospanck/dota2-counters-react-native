import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';

const transformSingleQuotesToDoubleQuotes = (text) => {
    return text.replace(/'/g, '"');
};

const storeData = async (value) => {
    try {
        const jsonValue = value;
        await AsyncStorage.setItem('counterHeroesKey', jsonValue)
    } catch (e) {        
        console.log("Error: " + e);
    }
}

export const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('counterHeroesKey');
        return jsonValue != null ? transformSingleQuotesToDoubleQuotes(jsonValue) : null;
    } catch (e) {
        console.log("Error: " + e);
    }
}

// TODO: change EC2 to port forwarding 443 to 7033 (server.js) or
// Add android:usesCleartextTraffic="true" in <application> tag in android\app\src\main\AndroidManifest.xml  <--- Didn't work
export const parseInfoFromServer = () => {

    const promise = new Promise((resolve, reject) => {
        // SSL self-signed certificate was throwin error on the normal fetch
        RNFetchBlob.config({
            trusty: true
        })
            .fetch('GET', 'https://{IP or DNS of Dota2CountersBackend}/dota2cp/api/')
            .then((resp) => {
                let response = resp.json();
                if (response.msg) {
                    if (response.msg == "Success") {
                        resolve(storeData(response.data));
                    }
                }
            })
            .catch((err) => reject(console.log(err)));
    });
    return promise;   
};
