import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';
import './App.css';
import './TemperatureTable.css';
import Amplify, { API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { createRPiTemperature } from './graphql/mutations';
import { listRPiTemperatures } from './graphql/queries';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
import moment from "moment-timezone";

function TemperatureTable() {
    const blankTemperature = { id: '', provider: "AWSIoTProvider", topic: "aws-iot-app", temperature: 0, createdOn: new Date(), updatedOn: new Date() }
    const [tempList, setTempList] = useState([{ ...blankTemperature }]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
  
    useEffect(() => {
      populateTemperatures();
    }, []);
  
    async function populateTemperatures() {
        setIsWriting(false);
        const listTemperatures = await API.graphql({ query: listRPiTemperatures });

        if(listTemperatures !== null) {
            const temperatures = listTemperatures.data.listRPiTemperatures.items;

            temperatures.sort(function(a, b) {
                return new Date(a.createdOn) - new Date(b.createdOn);
            });

            setTempList(temperatures);
  
            setIsLoaded(true);
        } else {
            console.warn("Query came back null");
        }
    }

    /**
     * Writes a recieved message to db
     */   
    async function writeMessage(RPProvider, RPValue) {
        if(!isWriting) {
            console.log('Message received from', RPProvider, 'message value', RPValue, 'logging to db...');
            setIsWriting(true);
            await API.graphql({ query: createRPiTemperature, variables: { input: { provider: "AWSIoTProvider", topic: "aws-iot-app", temperature: RPValue.message } } });
            populateTemperatures();
        } else {
            console.warn("Message ignored. Currently writing to db.")
        }
    }

    const formatXAxis = (tickItem) => {
        return moment(tickItem).format('DD-MM-YYYY HH:mm:ss').toString();
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
        <div id="TemperatureTable">
            <h1>AWS IOT - Raspberry Pi Temperature Sensor Readings</h1>

            {isLoaded && tempList !== null ? (
                <div id="TemperatureInfo">
                    <LineChart id="TempLineChart"
                        width={1000}
                        height={400}
                        data={tempList}
                    >
                        <XAxis dataKey="updatedOn" tickFormatter={formatXAxis} />

                        <YAxis dataKey="temperature" />

                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="temperature" stroke="#ff7300" yAxisId={0} />
                    </LineChart>

                    <table id="TemperatureTable" className="table-responsive table">
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
                                    Date
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
                                            {moment(temperature.createdOn).format('DD-MM-YYYY HH:mm:ss').toString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            ) : (
                <div id="TemperatureInfo">
                    <h3>Loading! Please wait...</h3>
                </div>
            )}

        </div>
    );
}

export default TemperatureTable;