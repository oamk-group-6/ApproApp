import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../styles/global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/navigation';

import { getStats, scansPerBar, mapBarNames, scansPerEvent, mapEventNames, getTopEvents } from "../firebase/services/statsService";
import { BarChart } from 'react-native-chart-kit';

type StatisticsProps = NativeStackScreenProps<RootStackParamList, 'Statistics'>

export default function Statistics({ navigation }: StatisticsProps) {
    const { width: screenWidth } = useWindowDimensions()
    const [barChartData, setBarChartData] = useState<any>(null)
    const [eventChartData, setEventChartData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const { scans, bars, qrcodes, events } = await getStats()

                const barCounts = scansPerBar(scans)
                const barMapped = mapBarNames(barCounts, bars)

                setBarChartData({
                    labels: barMapped.map(b => b.name),
                    datasets: [
                        {
                            data: barMapped.map(b => b.count),
                        },
                    ],
                })

                const eventCounts = scansPerEvent(scans, qrcodes)
                const eventMapped = mapEventNames(eventCounts, events)
                const topEvents = getTopEvents(eventMapped)

                setEventChartData({
                    labels: topEvents.map(e => e.name),
                    datasets: [
                        {
                            data: topEvents.map(e => e.count),
                        },
                    ],
                })
            }

            catch (error) {
                console.error("Stats error:", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Ladataan...</Text>
            </View>

        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tilastot</Text>

            <Text>Skannaukset per baari</Text>
            {barChartData && (
                <BarChart
                    data={barChartData}
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

            <Text>Skannaukset per tapahtuma (Top 5)</Text>
            {eventChartData && (
                <BarChart
                    data={eventChartData}
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