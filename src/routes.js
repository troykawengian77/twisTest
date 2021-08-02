import React from 'react'
import { Router, Scene, Actions } from 'react-native-router-flux'
import { width, height } from './lib/utils'
import { Root } from 'native-base'
import HomePage from './Screen/Home';
import OrderDetailsPage from './Screen/OrderDetails';

class Routes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Root>
                <Router>
                    <Scene hideNavBar key="root">
                        <Scene swipeEnabled={false} key="home" component={HomePage} title="Home" hideNavBar={true} init={true} />
                        <Scene swipeEnabled={false} key="orderDetail" component={OrderDetailsPage} title="Order Detail" hideNavBar={true} />
                    </Scene>
                </Router>
            </Root>
        )
    }
}

export default Routes;