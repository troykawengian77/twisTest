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
import { Container, Input, Picker, Switch } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { postData } from '../lib/components/ApiServices';
import CustomHeader from '../lib/components/CustomHeader';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { clearStorage, retrieveData, storeData } from '../lib/components/Helper';

class OrderDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false
        }
    }

    async componentDidMount() {
        // await clearStorage();
        let result = await retrieveData('sessionCart');
        let parseData = JSON.parse(result);
        if (parseData.length > 0) {
            this.setState({
                dataSource: parseData,
                loaded: true
            })
        } else {
            this.setState({ loaded: true });
        }
    }

    quantityHandler = (action, index) => {
        const newItems = [...this.state.dataSource];

        let currentQty = newItems[index]['itemQty'];

        if (action == 'more') {
            newItems[index]['itemQty'] = currentQty + 1;
        } else if (action == 'less') {
            newItems[index]['itemQty'] = currentQty > 1 ? currentQty - 1 : 1;
        }

        this.setState({ dataSource: newItems });
    }

    subtotalPrice = () => {
        const { dataSource } = this.state;
        if (dataSource) {
            return dataSource.reduce((sum, item) => sum + (item.itemQty * item.itemPrice), 0);
        }
        return 0;
    }

    renderItem = ({ item, index }) => {
        console.log(item.itemQty);
        const imagePath = "https://ranting.twisdev.com/uploads/";
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 15, marginBottom: 0, padding: 5, borderRadius: 5, backgroundColor: '#fff' }}>
                <View style={{ width: '25%', height: height * 0.15 }}>
                    <Image
                        style={{ flex: 1, height: undefined, width: undefined, borderRadius: 10 }}
                        source={item.itemImage ? { uri: imagePath + item.itemImage } : require('../assets/no_image.png')}
                    />
                </View>
                <View style={{ width: '50%' }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.itemDescription}</Text>
                        <Text style={{ fontSize: 16, color: '#F6A63D' }}>Rp. {item.itemPrice}</Text>
                    </View>
                </View>
                <View style={{ width: '25%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.quantityHandler('less', index)} style={{ width: '30%', backgroundColor: '#F7085E', alignItems: 'center', borderRadius: 5 }}>
                            <MCIcon name="minus" size={26} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ width: '35%', marginHorizontal: '3%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.itemQty}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.quantityHandler('more', index)} style={{ width: '30%', backgroundColor: '#0D8B8B', alignItems: 'center', borderRadius: 5 }}>
                            <MCIcon name="plus" size={26} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { loaded, dataSource } = this.state;
        return (
            <Container style={{ backgroundColor: '#eee' }}>
                <CustomHeader
                    left="chevron-back"
                    onLeft={() => Actions.pop()}
                    center={"Order Detail"}
                    right=""
                    onRight=""
                />
                {
                    loaded ?
                        dataSource ?
                            <FlatList
                                data={dataSource}
                                showsVerticalScrollIndicator={false}
                                renderItem={this.renderItem}
                                keyExtractor={(s, i) => i.toString()}
                                ListEmptyComponent={this.renderEmpty}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListFooterComponent={
                                    <View style={{ height: 100, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, flexDirection: 'row' }}>
                                        <View style={{ width: '70%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Harga</Text>
                                            <Text style={{ fontSize: 16, color: '#F6A63D' }}>Rp. {this.subtotalPrice().toFixed(2)}</Text>
                                        </View>
                                        <View style={{ width: '30%' }}>
                                            <TouchableOpacity style={{ backgroundColor: '#F6A63D', alignItems: 'center', borderRadius: 10, padding: 15 }}>
                                                <Text style={{ fontSize: 16, color: '#fff' }}>Order</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
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

export default OrderDetailsPage