/**
 * 
 */

import Header from '../components/Header';

export default class Index extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div className="g-content">
                    <Header/>
                    <div className="g-content-main">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount () {

    }

}

