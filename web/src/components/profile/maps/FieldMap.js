import React, {Component} from 'react'
import GoogleMapReact from 'google-map-react'


export default class FieldMap extends Component {
    constructor(props) {
        super(props)

        this.resetArea =                    this.resetArea.bind(this)
        this.onGoogleApiLoaded =            this.onGoogleApiLoaded.bind(this)
        this.onGoogleApiLoadedReadonly =    this.onGoogleApiLoadedReadonly.bind(this)

        this.state = {
            google: null,
            polygon: null,
            infoWindow: null,
            drawingManager: null,
            points: props.points
        }
    }

    mapOptions = maps => {
        return {
            mapTypeId: maps.MapTypeId.TERRAIN,
            mapTypeControl: true,
            zoomControlOptions: {
                position: maps.ControlPosition.TOP_RIGHT,
                style: maps.ZoomControlStyle.SMALL
            },
            resetBoundsOnResize: true,
            mapTypeControlOptions: {
                position: maps.ControlPosition.TOP_RIGHT,
                style: maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: [ maps.MapTypeId.TERRAIN, maps.MapTypeId.SATELLITE, maps.MapTypeId.HYBRID]
            }
        };
    };

    onGoogleApiLoadedReadonly(google) {
        let fieldPolygon = new google.maps.Polygon({
            paths: this.state.points,
            strokeColor: '#000000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#000000',
            fillOpacity: 0.35
          });
        fieldPolygon.setMap(google.map)

        let bounds = new google.maps.LatLngBounds();
        fieldPolygon.getPaths().forEach((path) => {
            path.forEach((latlng) => {
              bounds.extend(latlng);
              google.map.fitBounds(bounds);
            });
          });

        let infowindow = new google.maps.InfoWindow();
        infowindow.setContent(this.props.name);
        infowindow.setPosition(bounds.getCenter());
        infowindow.open(google.map);

        this.setState({ 
            polygon: fieldPolygon,
            infoWindow: infowindow
        })
    }

    onGoogleApiLoaded(google) {
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                drawingModes: ['polygon']
            },
            polygonOptions: {
              draggable: false,
              editable: false
            }
        });
        if (this.state.points.length !== 0) {
            this.onGoogleApiLoadedReadonly(google)
            this.setState({
                google: google,
                drawingManager: drawingManager
            })
            return
        }
          
        drawingManager.setDrawingMode(null)
        drawingManager.setMap(google.map);

        google.maps.event.addListener(drawingManager, 'polygoncomplete', (event) => {
            this.setState({
                polygon: event
            })
            
            let area = google.maps.geometry.spherical.computeArea(event.getPath());
            drawingManager.setDrawingMode(null);
            let square_area = "Area = "+ area.toFixed(2)+ " m²"
            if (area.toFixed(2) >= 1000000)
            square_area = "Area = "+ area.toFixed(2)/1000000 + " km²"
            
            let infowindow = new google.maps.InfoWindow();
            infowindow.setContent(square_area);
            infowindow.setPosition(event.getPath().getAt(0));
            infowindow.open(google.map);
            
            drawingManager.setOptions({
                drawingControl: false
            })

            let coordinatesArray = event.getPath().getArray()
            let pointArray = coordinatesArray.map(point => ({
                lat: point.lat(),
                lng: point.lng()
            }))
            this.setState({
                infoWindow: infowindow,
                polygon: event
            })
            this.props.onPolyComplete(pointArray, parseFloat(area.toFixed(2)))
        });
        
        this.setState({
            drawingManager: drawingManager,
            google: google,
        })
          
    }

    resetArea() {
        if (this.state.google !== null) {
            this.state.drawingManager.setMap(null)
            this.setState({
                infoWindow: null
            })
        }
        if (this.state.polygon !== null) {
            this.state.polygon.setMap(null)
            this.state.infoWindow.close()
            this.setState({
                polygon: null,
                infoWindow: null
            })
        }
        this.props.onPolyComplete([], null)
        this.state.points = []
        this.onGoogleApiLoaded(this.state.google)
    }

    render() {
        const t = this.props.dict
        return (
            <>
                {this.props.readonly !== true && (
                    <button type='button'  onClick={this.resetArea} className='btn btn-link float-right'>{t.d['reset_map']}</button>
                )}
                <div style={{ height: '50vh', width: '100%', padding: "10px" }}>
                    {this.props.readonly === true ? (
                    <GoogleMapReact
                          id='map-canvas'
                          yesIWantToUseGoogleMapApiInternals={true}
                          bootstrapURLKeys={{libraries: 'drawing', key: this.props.mapApiKey}}
                          onGoogleApiLoaded={this.onGoogleApiLoadedReadonly}
                          defaultZoom={8}
                          defaultCenter={this.props.mapCenter}
                          options={this.mapOptions}
                          mapTypeControl={true}
                          onClick={this.onClick}
                        >
                    </GoogleMapReact>
                    ) : (
                    <GoogleMapReact
                          id='map-canvas'
                          yesIWantToUseGoogleMapApiInternals={true}
                          bootstrapURLKeys={{libraries: 'drawing', key: this.props.mapApiKey}}
                          onGoogleApiLoaded={this.onGoogleApiLoaded}
                          defaultCenter={this.props.mapCenter}
                          defaultZoom={6}
                          options={this.mapOptions}
                          mapTypeControl={true}
                          onClick={this.onClick}
                        >
                    </GoogleMapReact>
                    )}
                </div>
            </>
            )
        }    
}