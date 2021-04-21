import { useState, useEffect } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { createRPiTemperature } from './graphql/mutations';
import { listRPiTemperatures } from './graphql/queries';

function TemperatureVisualization() {
    const blankTemperature = { id: '', provider: "AWSIoTProvider", topic: "aws-iot-app", temperature: 0, createdOn: new Date(), updatedOn: new Date() }
    const [tempList, setTempList] = useState([{ ...blankTemperature }]);
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(() => {
      populateTemperatures();
    }, []);
  
    async function populateTemperatures() {
        console.log("started querying");
        const listTemperatures = await API.graphql({ query: listRPiTemperatures })
        console.log("finished querying");
  
        if(listTemperatures !== null) {
            console.log("setting list");
/*             listTemperatures.map(element => {
                console.log("id: " + element.id);
                console.log("provider: " + element.provider);
                console.log("topic: " + element.topic);
                console.log("temperature: " + element.temperature);
                console.log("createdOn: " + element.createdOn);
                console.log("updatedOn: " + element.updatedOn);
            }); */
            setTempList(listTemperatures);

/*             tempList.map(element => {
                console.log("id: " + element.id);
                console.log("provider: " + element.provider);
                console.log("topic: " + element.topic);
                console.log("temperature: " + element.temperature);
                console.log("createdOn: " + element.createdOn);
                console.log("updatedOn: " + element.updatedOn);
            }); */
  
            setIsLoaded(true);
        } else {
            console.log("query came back null");
        }
    }

    /**
     * Writes a recieved message to db
     */   
    async function writeMessage(RPProvider, RPValue) {
        console.log('Message received from', RPProvider, 'message value', RPValue, 'logging to db...');
        await API.graphql({ query: createRPiTemperature, variables: { input: { provider: "AWSIoTProvider", topic: "aws-iot-app", temperature: RPValue.message } } });
        populateTemperatures();
    }

    Amplify.configure({
        Auth: {
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
        }
    });
    
    Amplify.addPluggable(new AWSIoTProvider({
        aws_pubsub_region: process.env.REACT_APP_REGION,
        aws_pubsub_endpoint: `wss://${process.env.REACT_APP_MQTT_ID}-ats.iot.${process.env.REACT_APP_REGION}.amazonaws.com/mqtt`,
    }));
    
    Amplify.PubSub.subscribe('aws-iot-app').subscribe({
        next: data => writeMessage(data.provider, data.value),
        error: error => console.error(error),
        close: () => console.log('Done'),
    });

    return (
        <div id="TemperatureVisualization">
            <h1>AWS IOT - Raspberry Pi Temperature Readings</h1>

            {isLoaded && tempList !== null && tempList.length > 0 ? (
                <table id="TrainingMaxTable">
                    <thead>
                        <tr>
                            <th scope="col">
                                ID
                            </th>
                            <th scope="col">
                                Provider
                            </th>
                            <th scope="col">
                                Topic
                            </th>
                            <th scope="col">
                                Temperature (°C)
                            </th>
                            <th scope="col">
                                Created On
                            </th>
                            <th scope="col">
                                Updated On
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tempList.map((temperature, idx) => (
                                <tr key={idx}>
                                    <td>
                                        {temperature.id}
                                    </td>
                                    <td>
                                        {temperature.provider}
                                    </td>
                                    <td>
                                        {temperature.topic}
                                    </td>
                                    <td>
                                        {temperature.temperature}
                                    </td>
                                    <td>
                                        {temperature.createdOn}
                                    </td>
                                    <td>
                                        {temperature.updatedOn}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            ) : (
                <div id="FitnessTrackerContainer">
                    <h3>Loading! Please wait...</h3>
                </div>
            )}

        </div>
    );
}

export default TemperatureVisualization;