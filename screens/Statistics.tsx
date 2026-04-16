import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../styles/global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/navigation';

import { getStats, scansPerBar, mapBarNames, } from "../firebase/services/statsService";
import { BarChart } from 'react-native-chart-kit';

type StatisticsProps = NativeStackScreenProps<RootStackParamList, 'Statistics'>

export default function Statistics({ navigation }: StatisticsProps) {
    const { width: screenWidth } = useWindowDimensions()
    const [chartData, setChartData] = useState<any>(null)

    useEffect(() => {
        const load = async () => {
            const { scans, bars } = await getStats()

            const counts = scansPerBar(scans)
            const mapped = mapBarNames(counts, bars)

            setChartData({
                labels: mapped.map(b => b.name),
                datasets: [
                    {
                        data: mapped.map(b => b.count),
                    },
                ],
            })
        }

        load()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tilastot</Text>

            <Text>Skannaukset per baari</Text>
            {chartData && (
                <BarChart
                    data={chartData}
                    width={screenWidth}
                    height={220}
                    fromZero
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(248, 95, 106, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    yAxisLabel=""
                    yAxisSuffix=""
                />
            )}

            <TouchableOpacity
                style={[globalStyles.button, styles.button]}
                onPress={() => navigation.goBack()}
            >
                <Text style={globalStyles.buttonText}>Takaisin</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 16,
    },
    text: {
        marginBottom: 16,
        fontSize: 32,
    },
});