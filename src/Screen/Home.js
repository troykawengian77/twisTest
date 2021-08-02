import React from 'react';
import {
    Alert, View, AsyncStorage, StyleSheet, Image, Text, TextInput, ActivityIndicator,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions } from 'react-native-router-flux';
import { width, height, RATIO, FONT } from '../lib/utils';
import { Container, Picker, Switch } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { postData } from '../lib/components/ApiServices';
import CustomHeader from '../lib/components/CustomHeader';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { clearStorage, retrieveData, storeData } from '../lib/components/Helper';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false
        }
    }

    async componentDidMount() {
        // await clearStorage();
        let result = await postData();
        if (result.status == 200) {
            this.setState({
                dataSource: result.data,
                loaded: true
            })
        } else {
            this.setState({ loaded: true });
        }
    }

    async addToCart(key) {
        let data = this.state.dataSource[key];
        let checkStock = data.stock;

        let objData = {
            'itemId': data.id,
            'itemDescription': data.description,
            'itemImage': data.default_photo.img_path,
            'itemPrice': data.price,
            'itemQty': 1
        }
        if (checkStock > 0) {
            let checkSession = await retrieveData('sessionCart');
            let arrData = [];
            if (checkSession) {
                let parseData = JSON.parse(checkSession);
                if (parseData.length > 0) {
                    let findData = parseData.find(element => element.itemId === data.id);
                    if (findData) {
                        parseData.forEach((val, index) => {
                            if (data.id === val.itemId) {
                                parseData[index].itemQty = parseData[index].itemQty + 1
                            }
                        });

                    } else {
                        parseData.push(objData);
                    }
                    await storeData('sessionCart', JSON.stringify(parseData));
                }
            } else {
                arrData.push(objData);
                await storeData('sessionCart', JSON.stringify(arrData));
            }
            this.refs.flashHome.showMessage({
                message: "Item added success",
                type: "success",
            });
        } else {
            this.refs.flashHome.showMessage({
                message: "Item Not Available",
                type: "danger",
            });
        }

    }

    renderItem = ({ item, index }) => {
        let basePath = 'https://ranting.twisdev.com/uploads/';
        let imageSource = basePath + item.default_photo.img_path;
        let stockColor = item.stock > 0 ? '#05C5F6' : '#F80003';
        let stockLabel = item.stock > 0 ? 'Ready Stock' : 'Not Available';

        return (
            <View style={{ width: '49%', marginHorizontal: '0.5%', marginVertical: '0.5%' }}>
                <TouchableOpacity onPress={() => this.addToCart(index)} key={index} style={{ borderRadius: 5, borderWidth: 0.5, borderColor: '#c4c4c4' }}>
                    <View style={{ width: '100%', height: height * 0.3 }}>
                        <Image style={{ flex: 1, width: undefined, height: undefined, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                            source={item.default_photo.img_path ? { uri: imageSource } : require('../assets/no_image.png')}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', padding: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.description}</Text>
                        <Text style={{ fontSize: 16, color: '#F6A63D' }}>Rp. {item.price}</Text>
                        <Text style={{ fontSize: 12, color: '#7c7c7c' }}>
                            <IIcon name="location-outline" size={12} />
                            {item.location_name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#7c7c7c' }}>
                            <MCIcon name="account" size={12} />
                            {item.added_user_name}
                        </Text>
                        <Text style={{ marginTop: 5, width: '60%', backgroundColor: stockColor, padding: 2.5, borderRadius: 5, textAlign: 'center', color: '#fff' }}>{stockLabel}</Text>
                        {
                            item.is_halal &&
                            <Image style={{ width: width * 0.1, height: width * 0.1, position: 'absolute', right: 5, bottom: 5 }}
                                source={require('../assets/logo-halal.jpg')}
                            />
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    subtotalPrice = () => {
        const { dataSource } = this.state;
        if (dataSource) {
            return dataSource.reduce((sum, item) => sum + item.price, 0);
        }
        return 0;
    }

    render() {
        const { loaded, dataSource } = this.state;
        
        return (
            <Container>
                <CustomHeader
                    left=""
                    onLeft=""
                    center={"Toko Halal"}
                    right="cart-outline"
                    onRight={() => Actions.orderDetail()}
                />
                {
                    loaded ?
                        dataSource ?
                            <FlatList
                                data={dataSource}
                                showsVerticalScrollIndicator={false}
                                renderItem={this.renderItem}
                                keyExtractor={(s, i) => i.toString()}
                                numColumns={2}
                                ListEmptyComponent={this.renderEmpty}
                                style={{ padding: 10 }}
                            />
                            :
                            <View style={{ height: height * 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                <Text>No Data Available</Text>
                            </View>
                        :
                        <View style={{ height: height * 0.9, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#0099BC" style={{
                                alignItems: 'center', justifyContent: 'center'
                            }}
                            />
                            <Text>Loading...</Text>
                        </View>
                }
                <FlashMessage ref="flashHome" position="top" floating={true} animated={true} />
            </Container>
        )
    }

}
const styles = StyleSheet.create({
    carouselContainer: {
        height: 200
    },
    carousel: {
        flex: 1,
        marginRight: 5
    }
})

export default HomePage