import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet
} from 'react-native';
import { Shadow } from 'react-native-shadow-2'
import {
    Profile,
    Home,
    Search
} from '../../screens';
import { COLORS, SIZES, FONTS, constants } from '../../constants'

const bottom_tabs = constants.bottom_tabs.map(tab => ({
    ...tab,
    ref: React.createRef()
}))

const TabIndicator = ({ measureLayout = [], scrollX }) => {
    const inputRange = bottom_tabs.map((_, i) => i * SIZES.width)

    const tabIndicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.width)
    })

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.x)
    })

    const dynamicStyles = {
        width: tabIndicatorWidth,
        transform: [{ translateX }]
    }

    return (
        <Animated.View style={[styles.tabIndicatorStyles, dynamicStyles]} />
    )
}

const Tabs = ({ scrollX, onButtonTabPress }) => {

    const containerRef = React.useRef()
    const [measureLayout, setMeasureLayout] = React.useState([])

    React.useEffect(() => {
        const ml = []
        bottom_tabs.forEach(bottomTab => {
            bottomTab?.ref?.current?.measureLayout(
                containerRef.current,
                (x, y, width, height) => {
                    ml.push({
                        x, y, width, height
                    })

                    if (ml.length === bottom_tabs.length) {
                        setMeasureLayout(ml)
                    }
                }
            )
        })

    }, [containerRef.current])

    return (
        <View ref={containerRef} style={styles.tabWrapper}>
            {/* tab indicator */}
            {measureLayout.length > 0 && <TabIndicator
                measureLayout={measureLayout}
                scrollX={scrollX}
            />}
            {/* tabs */}
            {bottom_tabs.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={`Bottom - tab - ${index} `}
                        ref={item.ref}
                        style={styles.tabItemButtonStyles}
                        onPress={() => onButtonTabPress(index)}
                    >
                        <Image
                            source={item.icon}
                            resizeMode='contain'
                            style={styles.tabIconStyles}
                        />
                        <Text
                            style={styles.tabLabelTextStyles}
                        >{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const MainLayout = () => {

    const flatListRef = React.useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const onButtonTabPress = React.useCallback(bottomTabIndex => {
        flatListRef?.current?.scrollToOffset({
            offset: bottomTabIndex * SIZES.width
        })
    })

    return (
        <View
            style={styles.mainLayoutWrapper}
        >
            {/* content section */}
            <View style={styles.renderContentWrapper}>
                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    snapToAlignment={'center'}
                    snapToInterval={SIZES.width}
                    decelerationRate={'fast'}
                    showsHorizontalScrollIndicator={false}
                    data={constants.bottom_tabs}
                    keyExtractor={item => `Main - ${item.id} `}
                    onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { x: scrollX } } }
                        ], {
                            useNativeDriver: false
                        })
                    }
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.renderedItemViewWrapper}>
                                {item.label === constants.screens.home && <Home />}
                                {item.label === constants.screens.search && <Search />}
                                {item.label === constants.screens.profile && <Profile />}
                            </View>
                        )
                    }}
                />
            </View>
            {/* bottom tabs */}

            <View style={styles.bottomTabWrapper}>
                {/* sizes take two props in an array
                    first one is the width 
                    second one is the height
                */}
                <Shadow size={[SIZES.width - (SIZES.padding * 2), 85]}>
                    <View style={styles.bottomTabView}>
                        <Tabs onButtonTabPress={onButtonTabPress} scrollX={scrollX} />
                    </View>
                </Shadow>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainLayoutWrapper: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    renderContentWrapper: {
        flex: 1,
    },
    renderedItemViewWrapper: {
        height: SIZES.height,
        width: SIZES.width
    },
    bottomTabWrapper: {
        marginBottom: 20,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.radius
    },
    bottomTabView: {
        flex: 1,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary3
    },
    tabWrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    tabItemButtonStyles: {
        flex: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabLabelTextStyles: {
        marginTop: 3,
        color: COLORS.white,
        ...FONTS.h3
    },
    tabIconStyles: {
        width: 25,
        height: 25
    },
    tabIndicatorStyles: {
        position: 'absolute',
        left: 0,
        height: '100%',
        width: '80%',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary
    }
})

export default MainLayout;