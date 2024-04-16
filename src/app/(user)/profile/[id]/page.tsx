import React from 'react'
import ChannelDashboard from '../../../../components/ChannelDashboard';
import BasicTabs from '../../../../components/ChannelTabs';

const PRIVATEUSERID = ({params}) => {
    const {id} = params
  return (
    <div className="m-6">
      <ChannelDashboard id={id}/>
      <BasicTabs id={id} />
    </div>
  );
}

export default PRIVATEUSERID 