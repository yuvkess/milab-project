const request = require('request');

class APIDataHandler{
    constructor(){

    }

    buildRequest(timestamp, monitoringRef, ){
        // macros and replace
        let dataTemplate = `<?xml version="1.0" ?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
	<S:Body>
		<siriWS:GetStopMonitoringService xmlns:siriWS="http://new.webservice.namespace" xmlns="" xmlns:ns4="http://www.ifopt.org.uk/ifopt" xmlns:ns3="http://www.ifopt.org.uk/acsb" xmlns:siri="http://www.siri.org.uk/siri">
			<Request>
				<siri:RequestTimestamp>2017-05-08T11:18:45.237+03:00</siri:RequestTimestamp>
				<siri:RequestorRef>YK565656</siri:RequestorRef>
				<siri:MessageIdentifier>AC:20170425:230410:981</siri:MessageIdentifier>
				<siri:StopMonitoringRequest version="2.7">
					<siri:RequestTimestamp>2017-05-08T11:18:45.237+03:00</siri:RequestTimestamp>
					<siri:MessageIdentifier>0</siri:MessageIdentifier>
					<siri:PreviewInterval>PT30M</siri:PreviewInterval>
					<siri:StartTime>2017-05-08T11:18:45.237+03:00</siri:StartTime>
					<siri:MonitoringRef>1786</siri:MonitoringRef>
					<siri:MaximumStopVisits>100</siri:MaximumStopVisits>
				</siri:StopMonitoringRequest>
			</Request>
		</siriWS:GetStopMonitoringService>
	</S:Body>
</S:Envelope>`;
    }

    getApiData(data){
        request({
            url: 'http://siri.motrealtime.co.il:8081/Siri/SiriServices',
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
