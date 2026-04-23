import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../styles/global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types/navigation';

import {
    getStats,
    scansPerBar,
    mapBarNames,
    scansPerEvent,
    mapEventNames,
    getTopEvents,
    getCumulativeScansPerEventPerHour,
    getScansPerHourPerEvent,
    getDegreeCounts
} from "../firebase/services/statsService";

import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

type StatisticsProps = NativeStackScreenProps<RootStackParamList, 'Statistics'>

export default function Statistics({ navigation }: StatisticsProps) {
    const { width: screenWidth } = useWindowDimensions()

    const [barChartData, setBarChartData] = useState<any>(null)
    const [eventChartData, setEventChartData] = useState<any>(null)
    const [degreeCounts, setDegreeCounts] = useState<Record<string, number> | null>(null)
    const [loading, setLoading] = useState(true)

    // Hourly per event
    const [eventHourlyList, setEventHourlyList] = useState<{ name: string; chartData: any }[]>([])
    const [selectedEventIndex, setSelectedEventIndex] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const { scans, bars, qrcodes, events } = await getStats()

                // Bars
                const barCounts = scansPerBar(scans)
                const barMapped = mapBarNames(barCounts, bars)
                setBarChartData({
                    labels: barMapped.map(b => b.name),
                    datasets: [{ data: barMapped.map(b => b.count) }],
                })

                // Events
                const eventCounts = scansPerEvent(scans, qrcodes)
                const eventMapped = mapEventNames(eventCounts, events)
                const topEvents = getTopEvents(eventMapped)
                setEventChartData({
                    labels: topEvents.map(e => e.name),
                    datasets: [{ data: topEvents.map(e => e.count) }],
                })

                // Hourly per event
                const hourData = await getScansPerHourPerEvent()
                const hours = Array.from({ length: 14 }, (_, i) => i + 10)

                const list = Object.entries(hourData).map(([eventId, hourMap]) => {
                    const event = events.find(e => e.id === eventId)
                    const data = hours.map(h => (hourMap as any)[h] ?? 0)
                    return {
                        name: (event as any)?.title || 'Tuntematon tapahtuma',
                        chartData: {
                            labels: hours.map(String),
                            datasets: [{ data }],
                        },
                    }
                })

                setEventHourlyList(list)

                // Degrees
                const degrees = await getDegreeCounts()
                setDegreeCounts(degrees)

            } catch (error) {
                console.error("Stats error:", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return (
            <View style={styles.loading}>
                <Text>Ladataan...</Text>
            </View>
        )
    }

    const currentEvent = eventHourlyList[selectedEventIndex]

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.text}>Tilastot</Text>

                {/* Hourly per event */}
                <Text style={styles.sectionTitle}>Skannaukset tunneittain per tapahtuma</Text>

                {eventHourlyList.length > 0 && (
                    <>
                        <View style={styles.eventSelector}>
                            <TouchableOpacity
                                onPress={() => setSelectedEventIndex(i => Math.max(0, i - 1))}
                                disabled={selectedEventIndex === 0}
                            >
                                <Text style={[styles.arrow, selectedEventIndex === 0 && styles.arrowDisabled]}>←</Text>
                            </TouchableOpacity>

                            <Text style={styles.eventName} numberOfLines={1}>
                                {currentEvent.name}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setSelectedEventIndex(i => Math.min(eventHourlyList.length - 1, i + 1))}
                                disabled={selectedEventIndex === eventHourlyList.length - 1}
                            >
                                <Text style={[styles.arrow, selectedEventIndex === eventHourlyList.length - 1 && styles.arrowDisabled]}>→</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.eventCounter}>
                            {selectedEventIndex + 1} / {eventHourlyList.length}
                        </Text>

                        <LineChart
                            data={currentEvent.chartData}
                            width={screenWidth}
                            height={220}
                            fromZero
                            //bezier
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(248, 95, 106, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            style={{ marginBottom: 20 }}
                        />
                    </>
                )}

                {/* Bar chart */}
                <Text style={styles.sectionTitle}>Skannaukset per baari</Text>
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

                {/* Events chart */}
                <Text style={styles.sectionTitle}>Skannaukset per tapahtuma (Top 5)</Text>
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

                {/* Degrees */}
                <Text style={styles.sectionTitle}>Suoritetut tutkinnot (%)</Text>

                {degreeCounts && (
                    <PieChart
                        data={Object.entries(degreeCounts).map(([name, value], index) => ({
                            name,
                            population: value,
                            color: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",
                                "#FF9F40",
                            ][index % 6],
                            legendFontColor: "#000",
                            legendFontSize: 12,
                        }))}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute={false}
                    />
                )}

                <TouchableOpacity
                    style={[globalStyles.button, styles.button]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={globalStyles.buttonText}>Takaisin</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    button: {
        marginTop: 16,
    },
    text: {
        marginBottom: 16,
        fontSize: 32,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 8,
    },
    eventSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        width: '100%',
        justifyContent: 'space-between',
    },
    eventName: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 22,
        paddingHorizontal: 8,
    },
    arrowDisabled: {
        opacity: 0.3,
    },
    eventCounter: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 8,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
}) 