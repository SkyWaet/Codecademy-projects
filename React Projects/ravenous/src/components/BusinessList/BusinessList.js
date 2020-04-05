import React from 'react';
import ReactDOM from 'react-dom';
import Business from "../Business/Business";
import './BusinessList.css';

class BusinessList extends React.Component{
    render(){
        return(
            <div className="BusinessList">
                <Business />
                <Business />
                <Business />
                <Business />
                <Business />
                <Business />
            </div>
        )
    }
}
export default BusinessList;