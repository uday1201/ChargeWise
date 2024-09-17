import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SmallChip } from './components/SmallChip';
import { Tabs } from './components/Tabs';
import StyleGuide, { SCREEN_HEIGHT, SCREEN_WIDTH } from './config/StyleGuide';
import { colors } from './config/colors';
import dayjs from 'dayjs';
import { EnergyDataPoint, SourceType, Tab } from './config/types';
import data from './config/data.json';
import { LineChart } from 'react-native-gifted-charts';
// import { useInterval } from './config/customHooks';
import { CustomIcon } from './components/CustomIcon';
import { CircleButton } from './components/CircleButton';

const tabs = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' }
]

const round = (num: number, sigFigs: number) => {
  if (num === 0) return 0;
  const multiplier = Math.pow(10, sigFigs - Math.floor(Math.log10(Math.abs(num))) - 1);
  return Math.round(num * multiplier) / multiplier;
}
const getSourceIcon = (source: string) => {
  if (source === 'coal') return 'bonfire';
  if (source === 'hydro') return 'water';
  if (source === 'solar') return 'sunny';
  if (source === 'nuclear') return 'nuclear';
  return 'leaf';
}

const capitalizeFirstLetter = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}


const currentDay = data.Date;
const startDate = currentDay + " 12:00";
const FORMAT = "YYYY-MM-DD HH:mm"
const dailyData: EnergyDataPoint[] = data['Data Series'].map(dataPoint => {
  return {
    ...dataPoint,
    Time: `${currentDay} ${dataPoint.Time}`
  }
})


const App = () => {
  const [date, setDate] = useState(dayjs(startDate, FORMAT))
  const [endWeekDate, setEndWeekDate] = useState(date.add(7, 'day'));
  const [chartData, setChartData] = useState<any[]>([]);
  // const [currentDataPoint, setCurrentDataPoint] = useState<EnergyData | null>(null);
  const [currentDataPointIndex, setCurrentDataPointIndex] = useState(0);

  const currentDataPoint = useMemo(() => {
    return dailyData[currentDataPointIndex]
  }, [currentDataPointIndex])
  

  const averagePrice = useMemo(() => {
    const total = dailyData.reduce((sum: number, entry: EnergyDataPoint) => sum + entry["Price (per kWh)"], 0);
    return total / dailyData.length;
  }, [dailyData]);

  const isCharging = useMemo(() => {
    if (!currentDataPoint) return false;
    return currentDataPoint['Price (per kWh)'] < averagePrice;
  }, [averagePrice, currentDataPoint])

  const nextChargingTime = useMemo(() => {
    let startTime = null;
    let endTime = null;
    let continueLoop = true;
    for (let i = 0; i < dailyData.length; i++) {
      if (i <= currentDataPointIndex) continue;
      const dataPoint = dailyData[i];
      const isChargingHour = dataPoint['Price (per kWh)'] < averagePrice;
      if (startTime === null) {
        if (isChargingHour !== isCharging) {
          startTime = dataPoint.Time;
        }
      } else if (continueLoop) {
        if (isChargingHour !== isCharging) {
          endTime = dataPoint.Time
        } else {
          continueLoop = false;
        }
      }
    }
    return {startTime, endTime}
  }, [currentDataPoint, isCharging])


  // useInterval(() => {
  //   setDate((_date) => {
  //     return dayjs(_date).add(3, 'seconds');
  //   })
  // }, 3000);

  const renderNowLabel = (dataPoint: EnergyDataPoint) => {
    return <View style={styles.labelContainer}>
      <View style={styles.sourceLabel}>
        <CustomIcon name={getSourceIcon(dataPoint['Source (Primary)'])} size={StyleGuide.size.s12} color={colors.primary} />
        <Text style={styles.label}>{` ${capitalizeFirstLetter(dataPoint['Source (Primary)'])}`}</Text>
      </View>
      <Text style={styles.label}>{`$${round(dataPoint['Price (per kWh)'], 3)} /kWh`}</Text>
    </View>
  }

  useEffect(() => {
    const data = dailyData;
    const _chartData = [];
    let _currentDataPointIndex = 0;
    for (let i = 0; i < data.length; i++) {
      const dataPoint = data[i];
      let additionalProps: any = {};
      const isNow = dayjs(dataPoint.Time, FORMAT).isSame(date, "hour");
      if (i % 4 === 0) {
        additionalProps.label = dayjs(dataPoint.Time).format('ha');
      } else {
        additionalProps.label = '';
      }
      if (isNow) {
        _currentDataPointIndex = i;
        additionalProps.dataPointRadius = 8;
        additionalProps.dataPointColor = colors.lineColor;
        additionalProps.dataPointLabelComponent = () => renderNowLabel(dataPoint)
      } else {
        additionalProps.dataPointRadius = 0;
        // additionalProps.hideDataPoint = true;
      }
      _chartData.push(
        { 
          value: dataPoint['Price (per kWh)'],
          showStrip: true,
          stripHeight: SCREEN_HEIGHT * 0.4,
          stripColor: dataPoint['Price (per kWh)'] > averagePrice ? colors.danger : colors.success,
          stripWidth: 11,
          stripOpacity: isNow ? 0.4 : 0.15,
          ...additionalProps
        }
      )
    }
    setChartData(_chartData);
    setCurrentDataPointIndex(_currentDataPointIndex);
  }, [date]);

  const sourceIcon = useMemo(() => {
    if (!currentDataPoint) return '';
    const source = currentDataPoint['Source (Primary)']
    return getSourceIcon(source)
  }, [currentDataPoint]);

  const isClean = useMemo(() => {
    if (!currentDataPoint) return false;
    const source = currentDataPoint['Source (Primary)'];
    if (source === 'coal') return false;
    return true;

  }, [currentDataPoint]);

  // const onChartPress = (index: number) => {
  //   console.log(index)
  // }

  const onLeftButtonPress = () => {
    setDate(_date => _date.subtract(1, "hour"))
  }

  const onRightButtonPress = () => {
    setDate(_date => _date.add(1, "hour"))
  }

  const renderTab = (tab: Tab) => {
    return (
      <View style={styles.tabContainer}>
        <View style={styles.locationContainer}>
          <CustomIcon name={'navigate'} color={colors.accent}/>
          <Text style={styles.location}>Coffeyville, KS</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tab.id === 'day' ? 'Today' : 'Week'}</Text>
          <SmallChip
            label={isCharging ? 'Charge' : 'Off Grid'}
            icon={isCharging ? 'battery-charging' : 'battery-half'}
            iconSize={StyleGuide.size.s24}
            labelStyle={styles.chargeLabelStyle}
            success={isCharging}
            danger={!isCharging}
            style={styles.chargeChipStyle}
          />
        </View>
        {tab.id === 'day' && <Text style={styles.subHeading}>{date.format('ddd DD MMM YYYY HH:mma')}</Text>}
        {tab.id === 'week' && <Text style={styles.subHeading}>{date.format('DD MMM YYYY')} - {endWeekDate.format('DD MMM YYYY')}</Text>}
        {currentDataPoint && <View style={styles.infoContainer}>
          <SmallChip label={`Saving: $${Math.abs(round(averagePrice - currentDataPoint['Price (per kWh)'], 2))}`} success />
          <SmallChip label={'Source: ' + capitalizeFirstLetter(currentDataPoint['Source (Primary)'])} success={isClean} danger={!isClean} icon={sourceIcon} />
          <SmallChip label={Math.round(currentDataPoint['% Clean Energy']) + '% Clean'} success={currentDataPoint['% Clean Energy'] >= 50} danger={currentDataPoint['% Clean Energy'] < 50} />
        </View>}
        <View style={styles.chartContainer}>
          <LineChart
            areaChart
            data={chartData}
            width={SCREEN_WIDTH * 0.9}
            spacing={13}
            curved
            curveType={0}
            noOfSections={3}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ width: 40 }}
            thickness={5}
            color={colors.lineColor}
            startFillColor={colors.lineColor}
            endFillColor={colors.lineColor}
            startOpacity={0.4}
            endOpacity={0}
            // onPress={onChartPress}
          />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SmallChip label={'Your Savings: $400'} />
        <SmallChip label={'Yes'} icon={'person'} />
      </View>
      <View style={styles.tabsContainer}>
        <Tabs
          tabs={tabs}
          tabStyle={styles.tabStyle}
          renderTab={renderTab}
        // onTabChange={setCurrentTab}
        />
      </View>
      <View style={styles.nextContainer}>
        <Text style={styles.nextText}>
          Next <Text style={{color: isCharging ? colors.danger : colors.success}}>{isCharging ? 'Off-Grid' : 'Charge'}</Text> Time:
        </Text>
        <Text style={styles.nextTime}>{
          nextChargingTime.startTime ? 
          `${dayjs(nextChargingTime.startTime, FORMAT).format('ha')} - ${dayjs(nextChargingTime.endTime, FORMAT).format('ha')}` :
          'Tomorrow'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <CircleButton
          onPress={onLeftButtonPress}
          size={StyleGuide.size.s46}
          icon={'chevron-back'}
          disabled={currentDataPointIndex === 0}
        />
        <CircleButton
          onPress={onRightButtonPress}
          size={StyleGuide.size.s46}
          icon={'chevron-forward'}
          disabled={currentDataPointIndex === (dailyData.length - 1)}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%'
  },
  header: {
    paddingHorizontal: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabsContainer: {
    marginTop: '10%',
    height: SCREEN_HEIGHT * 0.64
  },
  tabStyle: {
    paddingTop: '2%',
    paddingBottom: '10%',
    height: SCREEN_HEIGHT * 0.8
  },
  tabContainer: {
    paddingHorizontal: '5%'
  },
  title: {
    fontSize: StyleGuide.size.s40,
    fontFamily: StyleGuide.fonts.extraBold,
    color: colors.primary
  },
  subHeading: {
    fontSize: StyleGuide.size.s14,
    fontFamily: StyleGuide.fonts.bold,
    color: colors.accent
  },
  chartContainer: {
    marginTop: '8%',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.4,

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chargeLabelStyle: {
    fontSize: StyleGuide.size.s16,
    fontFamily: StyleGuide.fonts.bold
  },
  chargeChipStyle: {
    paddingHorizontal: '4%',
    marginLeft: '5%'
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: '3%',
  },
  sourceLabel: {
    flexDirection: 'row'
  },
  label: {
    fontSize: StyleGuide.size.s11,
    fontFamily: StyleGuide.fonts.extraBold,
    color: colors.primary
  },
  labelContainer: {
    bottom: 50,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    padding: 4,
    borderRadius: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  location: {
    marginLeft: '2%',
    color: colors.accent,
    fontSize: StyleGuide.size.s14,
    fontFamily: StyleGuide.fonts.bold,
  },
  nextContainer: {
    marginHorizontal: '5%',
  },
  nextText: {
    fontSize: StyleGuide.size.s16,
    fontFamily: StyleGuide.fonts.extraBold,
    color: colors.primary
  },
  nextTime: {
    fontSize: StyleGuide.size.s28,
    fontFamily: StyleGuide.fonts.extraBold,
    color: colors.primary
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    marginTop: '3%'
  }
});

export default App;
