const request = require('request');

class APIDataHandler{
    static _buildRequest(timestamp){
        // macros and replace
        let date = new Date(timestamp);
        let day = `${date.getDate()}`;
        day = day.length < 2 ? `0${day}` : day;
        let month = `${date.getMonth() + 1}`;
        month = month.length < 2 ? `0${month}` : month;
        let year = date.getFullYear();
        let hour = `${date.getHours()}`;
        hour = hour.length < 2 ? `0${hour}` : hour;
        let minutes = `${date.getMinutes()}`;
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;
        let seconds = `${date.getSeconds()}`;
        seconds = seconds.length < 2 ? `0${seconds}` : seconds;
        let time = `${hour}:${minutes}:${seconds}.${date.getMilliseconds()}`;
        let interval = '30';
        let dataTemplate = `<?xml version="1.0" ?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
	<S:Body>
		<siriWS:GetStopMonitoringService xmlns:siriWS="http://new.webservice.namespace" xmlns="" xmlns:ns4="http://www.ifopt.org.uk/ifopt" xmlns:ns3="http://www.ifopt.org.uk/acsb" xmlns:siri="http://www.siri.org.uk/siri">
            <Request>
				<siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
				<siri:RequestorRef>YK565656</siri:RequestorRef>
				<siri:MessageIdentifier>AC:20170425:230410:981</siri:MessageIdentifier>
				<siri:StopMonitoringRequest version="2.7">
					<siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
					<siri:MessageIdentifier>0</siri:MessageIdentifier>
					<siri:PreviewInterval>PT${interval}M</siri:PreviewInterval>
					<siri:StartTime>${year}-${day}-${month}T${time}+03:00</siri:StartTime>
					<siri:MonitoringRef>25893</siri:MonitoringRef>
					<siri:MaximumStopVisits>100</siri:MaximumStopVisits>
                </siri:StopMonitoringRequest>
                <siri:StopMonitoringRequest version="2.7">
					<siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
					<siri:MessageIdentifier>0</siri:MessageIdentifier>
					<siri:PreviewInterval>PT${interval}M</siri:PreviewInterval>
					<siri:StartTime>${year}-${day}-${month}T${time}+03:00</siri:StartTime>
					<siri:MonitoringRef>25852</siri:MonitoringRef>
					<siri:MaximumStopVisits>100</siri:MaximumStopVisits>
                </siri:StopMonitoringRequest>
                <siri:StopMonitoringRequest version="2.7">
                    <siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
                    <siri:MessageIdentifier>0</siri:MessageIdentifier>
                    <siri:PreviewInterval>PT${interval}M</siri:PreviewInterval>
                    <siri:StartTime>${year}-${day}-${month}T${time}+03:00</siri:StartTime>
                    <siri:MonitoringRef>21157</siri:MonitoringRef>
                    <siri:MaximumStopVisits>100</siri:MaximumStopVisits>
                </siri:StopMonitoringRequest>
                <siri:StopMonitoringRequest version="2.7">
                    <siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
                    <siri:MessageIdentifier>0</siri:MessageIdentifier>
                    <siri:PreviewInterval>PT${interval}M</siri:PreviewInterval>
                    <siri:StartTime>${year}-${day}-${month}T${time}+03:00</siri:StartTime>
                    <siri:MonitoringRef>25823</siri:MonitoringRef>
                    <siri:MaximumStopVisits>100</siri:MaximumStopVisits>
                </siri:StopMonitoringRequest>
                <siri:StopMonitoringRequest version="2.7">
                <siri:RequestTimestamp>${year}-${day}-${month}T${time}+03:00</siri:RequestTimestamp>
                    <siri:MessageIdentifier>0</siri:MessageIdentifier>
                    <siri:PreviewInterval>PT${interval}M</siri:PreviewInterval>
                    <siri:StartTime>${year}-${day}-${month}T${time}+03:00</siri:StartTime>
                    <siri:MonitoringRef>21367</siri:MonitoringRef>
                    <siri:MaximumStopVisits>100</siri:MaximumStopVisits>
                </siri:StopMonitoringRequest>
			</Request>
		</siriWS:GetStopMonitoringService>
	</S:Body>
</S:Envelope>`;

        return dataTemplate;
    }

    static getApiData(timestamp){
        let data = this._buildRequest(timestamp);
        request({
            url: 'http://georgy.referer.io/Siri/SiriServices',
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'text/xml',
                'Accept': 'multipart/related',
                'Content-Length': data.length
            },
            body: data
        }, function(err, res){
            if (err) {
                console.log(err);
            }
            console.log(res.body);
            return res.body;
        })
    }

    parseResponse(response){
        //TODO
    }
}

module.exports = APIDataHandler;
