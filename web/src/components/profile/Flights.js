import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap'

export default class Flights extends Component {
    constructor(props) {
        super(props)

        this.handleChange =         this.handleChange.bind(this)
        this.handleFilter =         this.handleFilter.bind(this)
        this.handleResetFilter =    this.handleResetFilter.bind(this)
        this.fetchAll =             this.fetchAll.bind(this)
        this.fetchFlights =         this.fetchFlights.bind(this)
        this.ModalAdd =             this.ModalAdd.bind(this)
        this.ModalInfo =            this.ModalInfo.bind(this)
        this.ModalEdit =            this.ModalEdit.bind(this)
        this.ModalDelete =          this.ModalDelete.bind(this)
        this.handleCallDelete =     this.handleCallDelete.bind(this)
        this.handleCallEdit =       this.handleCallEdit.bind(this)
        this.handleChangeStatus =   this.handleChangeStatus.bind(this)


        this.state = {
            isLoading: true,
            allFlights: [],
            flights:[],
            areas: [],
            drones: [],
            
            modalError: '',
            modalMessage: '',
            name: '',
            time: '',
            interval: 0,
            areaId: -1,
            droneId: -1,
            
            filterName: '',
            filterDroneId: -1,
            filterAreaId: -1,
            filterActive: false,
            filterCounter: undefined,

            modalDeleteOpen: false,
            deleteName: "",
            deleteId: '',

            modalAddOpen: false,

            modalInfoOpen: false,

            modalEditOpen: false,
            editId: '',
            editName: '',
            editAreaId: -1,
            editDroneId: -1,
            editTime: '',
            editInterval: undefined,
            editMessage: '',
            editError: ''
        }
        this.fetchAll()
    }

    
    fetchAll() {
        fetch(`${this.props.proxy}/api/drones`, {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token
            })
        }).then(r =>  r.json()
        .then(data => ({status: r.status, body: data})))
        .then(obj => {
                if (obj.status === 401) {
                    this.props.onTokenChange("")
                }
                else {
                this.setState({
                    drones: obj.body
                })
            }
        }).then(
            fetch(`${this.props.proxy}/api/areas`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'token': this.props.token
                })
            })
                .then(r =>  r.json()
                .then(data => ({status: r.status, body: data})))
                .then(obj => {
                    if (obj.status === 401) {
                        this.props.onTokenChange("")
                    }
                    else {
                    this.setState({
                        areas: obj.body
                    })
                }
            }).then(
                fetch(`${this.props.proxy}/api/flights`, {
                    method: 'POST', 
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'token': this.props.token
                    })
                })
                    .then(r =>  r.json()
                    .then(data => ({status: r.status, body: data})))
                    .then(obj => {
                        if (obj.status === 401) {
                            this.props.onTokenChange("")
                        }
                        else {
                        this.setState({
                            allFlights: obj.body,
                            flights: obj.body,
                            isLoading: false
                        })
                    }
                })
            )
        )
    }

    fetchFlights() {
        fetch(`${this.props.proxy}/api/flights`, {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token
            })
        })
            .then(r =>  r.json()
            .then(data => ({status: r.status, body: data})))
            .then(obj => {
                if (obj.status === 401) {
                    this.props.onTokenChange("")
                }
                else {
                this.setState({
                    allFlights: obj.body,
                    flights: obj.body,
                    isLoading: false
                })
            }
        })
    }

    handleChange(event) {
        if (event.target.name === 'filterActive')
            this.setState({[event.target.name]: !this.state.filterActive})
        else
            this.setState({
                [event.target.name]: event.target.value
            })
    }

    handleFilter(event) {
        event.preventDefault()

        let flights_obj = this.state.allFlights
        let flights = []
        for (let i = 0; i < flights_obj.length; i++) {
            let flight = flights_obj[i]
            if (this.state.filterName !== '')
                if (flight.name.indexOf(this.state.filterName) === -1)
                    continue
            if (flight.active !== this.state.filterActive)
                continue
            if (Number.parseInt(this.state.filterAreaId) !== -1)
                if (flight.area.id !== Number.parseInt(this.state.filterAreaId))
                    continue
            if (Number.parseInt(this.state.filterDroneId) !== -1)
                if (flight.drone.id !== Number.parseInt(this.state.filterDroneId))
                    continue
            flights.push(flight)
        }
        this.setState({
            flights: flights,
            filterCounter: flights.length
        })
    }

    handleResetFilter(event) {
        event.preventDefault()


        this.setState({
            filterName: '',
            filterAreaId: -1,
            filterDroneId: -1,
            filterActive: false,
            flights: this.state.allFlights,
            filterCounter: undefined
        })
    }

    handleCallEdit(flight) {
        this.setState({
            modalEditOpen: true,
            editId: flight.id,
            editName: flight.name,
            editAreaId: flight.area.id,
            editDroneId: flight.drone.id,
            editTime: flight.time,
            editInterval: flight.interval,
            editActive: flight.active,
            editMessage: '',
            editError: ''
        })
    }

    handleCallDelete(flight) {
        this.setState({
            deleteId: flight.id,
            deleteName: flight.name,
            modalDeleteOpen: true
        })
    }

    ModalDelete() {
        const handleClose = () => {this.setState({modalDeleteOpen: false})}
        const handleDelete = (event) => {
            event.preventDefault()
            let obj = {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.props.token,
                    id: this.state.deleteId
                })
            }
            fetch(`${this.props.proxy}/api/delete_flight`, obj)
            .then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    this.setState({modalInfoOpen: true, modalMessage: data.body.error, modalDeleteOpen: false})
                } else {
                    this.setState({modalDeleteOpen: false})
                    this.fetchAll()
                }
            })
        }

        return (
            <>
                <Modal
                    show={this.state.modalDeleteOpen}
                    onHide={handleClose}
                    centered
                >
                <form onSubmit={handleDelete}>
                    <Modal.Header>
                        <Modal.Title closeButton>{this.props.dict.d['confirm_delete']}</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <p>{this.props.dict.confirmDelete(this.state.deleteName)}</p>
                            <Button style={{marginRight: "20px"}} type='submit' variant="primary">{this.props.dict.d['delete']}</Button>
                            <Button onClick={handleClose} variant="secondary">{this.props.dict.d['close']}</Button>
                        </Modal.Body>
                </form>
                </Modal>
            </>
        )
    }

    ModalEdit() {
        const handleClose = () => {
            this.setState({
                modalEditOpen: false,
                editId: '',
                editName: '',
                editDroneId: -1,
                editAreaId: -1,
                editTime: '',
                editMessage: '',
                editError: '',
                editActive: ''
            })
        }
        let handleEdit = (event) => {
            event.preventDefault()
            if (Number.parseInt(this.state.editAreaId) === -1){
                this.setState({editError: this.props.dict.d['field_empty']})
                return
            }
            if (Number.parseInt(this.state.editDroneId) === -1) {
                this.setState({editError: this.props.dict.d['drone_empty']})
                return
            }
            let obj = {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.props.token,
                    id: this.state.editId,
                    name: this.state.editName,
                    area_id: this.state.editAreaId,
                    drone_id: this.state.editDroneId,
                    interval: this.state.editInterval,
                    time: this.state.editTime,
                    active: this.state.editActive
                })
            }
            fetch(`${this.props.proxy}/api/update_flight`, obj).then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    this.setState({
                        editError: data.body.error
                    })
                } else {
                    this.setState({
                        modalEditOpen: false,
                        modalInfoOpen: true,
                        modalMessage: this.props.dict.d['info_updated']
                    })
                    this.fetchFlights()
                }
            })
        }

        let fieldOptions = this.state.areas.map(field => {
            return <option key={field.id} label={field.name} value={field.id}/>
        })
        let droneOptions = this.state.drones.map(drone => {
            return <option key={drone.id} label={drone.name} value={drone.id}/>
        })

        let rangeLabel = this.props.dict.rangeLabel(this.state.editInterval)
        const t = this.props.dict
        return (
            <>
              <Modal centered show={this.state.modalEditOpen} onHide={handleClose}>
                <form onSubmit={handleEdit}>
                <Modal.Header closeButton>
                  <Modal.Title>{t.d['edit_flight']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                          {this.state.editError !== '' && (
                              <div className='alert alert-danger'>
                                  {this.state.editError}
                              </div>
                          )}
                          <div className='form-group'>
                              <label>{t.d['name']}</label>
                              <input 
                                  className='form-control' 
                                  name='editName'
                                  placeholder={t.d['name']}
                                  type='text'
                                  value={this.state.editName}
                                  onChange={this.handleChange}
                                  pattern='^[^\s]*$'
                                  required
                              />
                              <small>{t.d['flight_name']}</small>
                          </div>
                          <div className='form-group'>
                              <label>{t.d['field']}</label>
                              <select className='form-control' name='editAreaId' value={this.state.editAreaId} onChange={this.handleChange}>
                                  <option label={t.d['not_selected']} value={-1}/>
                                  {fieldOptions}
                              </select>
                          </div>
                          <div className='form-group'>
                              <label>{t.d['drone']}</label>
                              <select className='form-control' name='editDroneId' value={this.state.editDroneId} onChange={this.handleChange}>
                                  <option label={t.d['not_selected']} value={-1}/>
                                  {droneOptions}
                              </select>
                          </div>
                          <div className='form-group'>
                              <label>{t.d['interval']}</label>
                              <input
                                  className='form-control'
                                  type='range'
                                  name='editInterval'
                                  min='0'
                                  max='30'
                                  value={this.state.editInterval}
                                  onChange={this.handleChange}
                              />
                              <small>{rangeLabel}</small>
                          </div>
                          <div className='form-group'>
                              <label>{t.d['time']}</label>
                              <input 
                                  className='form-control'
                                  value={this.state.editTime}
                                  onChange={this.handleChange}
                                  type="time" 
                                  name="editTime"
                                  min="00:00"
                                  max="23:59"
                                  required/>
                              <small>{t.d['flight_time']}</small>
                          </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button type='submit' variant="primary">
                      {t.d['submit']}
                  </Button>
                </Modal.Footer>
                  </form>
              </Modal>
            </>
          );
    }

    ModalInfo() {
        const handleClose = () => {
            this.setState({
                modalInfoOpen: false
            })
        }
        const t = this.props.dict
        return (
            <>
                <Modal
                    centered
                    size='sm'
                    show={this.state.modalInfoOpen}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        {t.d['info']}
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalMessage}
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    ModalAdd() {
        let fieldOptions = this.state.areas.map(field => {
            return <option key={field.id} label={field.name} value={field.id}/>
        })
        let droneOptions = this.state.drones.map(drone => {
            return <option key={drone.id} label={drone.name} value={drone.id}/>
        })
        
        const t = this.props.dict
        const handleClose = () => this.setState({
            modalAddOpen: false,
            name: "",
            droneId: -1,
            areaId: -1,
            interval: 0,
            time: "00:00"
        });
        const handleShow = () => this.setState({modalAddOpen: true});
        const handleAdd = (event) => {
            event.preventDefault()
            if (Number.parseInt(this.state.areaId) === -1) {
                this.setState({modalError: t.d['field_empty']})
                return
            }
            if (Number.parseInt(this.state.droneId) === -1) {
                this.setState({modalError: t.d['field_empty']})
                return
            }
            let obj = {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    time: this.state.time,
                    area_id: this.state.areaId,
                    drone_id: this.state.droneId,
                    interval: this.state.interval,
                    token: this.props.token
                })
            }
            fetch(`${this.props.proxy}/api/add_flight`, obj)
            .then(r => r.json().then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    this.setState({
                        modalError: data.body.error
                    })
                } else {
                    this.setState({
                        modalMessage: this.props.dict.d['flight_added'],
                        modalInfoOpen: true, 
                        modalAddOpen: false,
                        name: '',
                        code: '',
                        model: ''
                    })
                    this.setState({
                        droneId: -1,
                        areaId: -1,
                        interval: 0,
                        time: "00:00"
                    })
                    this.fetchFlights()
                }
            })
        }

        let rangeLabel = this.props.dict.rangeLabel(this.state.interval)
      
        return (
          <>
            <button onClick={handleShow} type='button' data-toggle="modal" data-target="#addModal" className='btn btn-outline-primary btn-lg btn-block'>{t.d['add']}</button>
      
            <Modal centered show={this.state.modalAddOpen} onHide={handleClose}>
              <form onSubmit={handleAdd}>
              <Modal.Header closeButton>
                <Modal.Title>{t.d['add_flight']}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                        {this.state.modalError !== '' && (
                            <div className='alert alert-danger'>
                                {this.state.modalError}
                            </div>
                        )}
                        <div className='form-group'>
                            <label>{t.d['name']}</label>
                            <input 
                                className='form-control' 
                                name='name'
                                placeholder={t.d['name']}
                                type='text'
                                value={this.state.name}
                                onChange={this.handleChange}
                                pattern='^[^\s]*$'
                                required
                            />
                            <small>{t.d['flight_name']}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['field']}</label>
                            <select className='form-control' name='areaId' value={this.state.areaId} onChange={this.handleChange}>
                                <option label={t.d['not_selected']} value={-1}/>
                                {fieldOptions}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['drone']}</label>
                            <select className='form-control' name='droneId' value={this.state.droneId} onChange={this.handleChange}>
                                <option label={t.d['not_selected']} value={-1}/>
                                {droneOptions}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['interval']}</label>
                            <input
                                className='form-control'
                                type='range'
                                name='interval'
                                min='0'
                                max='30'
                                value={this.state.interval}
                                onChange={this.handleChange}
                            />
                            <small>{rangeLabel}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['time']}</label>
                            <input 
                                className='form-control'
                                value={this.state.time}
                                onChange={this.handleChange}
                                type="time" 
                                name="time"
                                min="00:00"
                                max="23:59"
                                required/>
                            <small>{t.d['flight_time']}</small>
                        </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type='submit' variant="primary">
                    {t.d['submit']}
                </Button>
              </Modal.Footer>
                </form>
            </Modal>
          </>
        );
      }

    handleChangeStatus(flight) {
        let obj = {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token,
                'id': flight.id,
                'name': flight.name,
                'area_id': flight.area.id,
                'drone_id': flight.drone.id,
                'interval': flight.interval,
                'time': flight.time,
                'active': !flight.active
            })
        }
        fetch(`${this.props.proxy}/api/update_flight`, obj).then(r => r.json()
        .then(data => ({status: r.status, body: data})))
        .then(data => {
            if (data.status === 400) {
                this.setState({
                    modalMessage: data.body.error,
                    modalInfoOpen: true
                })
            } else {
                this.fetchFlights()
            }
        })
        flight.status = !flight.status
    }

    render() {
        const t = this.props.dict
        if (this.props.token === "")
            return (
                <Redirect to="/login"/>
            )
        let flights_obj = this.state.flights
        flights_obj.sort((a, b) => a.id > b.id ? 1: -1)
        let flights = flights_obj.map(flight => {
            let interval = t.rangeLabel(flight.interval)
            let current = new Date()
            let time = flight.time.split(':')
            let hour = Number.parseInt(time[0])
            let minute = Number.parseInt(time[1])
            let date = new Date(current.getFullYear(), current.getMonth(), current.getDate(),
                            hour, minute, 0)
            if (current > date) 
                date = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1,
                    hour, minute, 0)
            let next_flight = `${t.d["next_flight"]}: ${date.getDate().toString().padStart(2, 0)}.${date.getMonth().toString().padStart(2, 0)} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`
            return (
                <li key={flight.id} className='row' style={{marginBottom: "30px"}}>
                    <div className='col-12'>
                        <div className='card text-left' style={{paddingRight: "0px"}}>
                                <div className='card-header'>
                                <div className='row'>
                                    <div className='col-9'>
                                        <h5>{flight.name}</h5>
                                    </div>
                                    <div className='col-1'>
                                        <div className="custom-control custom-switch" data-toggle="tooltip" data-placement="bottom" title={t.d['switch']} style={{padding:"6px 12px"}}>
                                            <input
                                                type="checkbox" 
                                                checked={flight.active} 
                                                onChange={() => this.handleChangeStatus(flight)} 
                                                className="custom-control-input" 
                                                id={`flightSwitch${flight.id}`}    
                                                />
                                          <label className="custom-control-label" htmlFor={`flightSwitch${flight.id}`}/>
                                        </div>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallEdit(flight)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['edit']}>
                                            <img alt={t.d['edit']} style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/edit-icon.png'}></img>
                                        </button>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallDelete(flight)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['delete']}>
                                            <img alt={t.d['delete']} style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/delete-icon.png'}></img>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p className='card-text'>{t.d['flight_obj_field']}: {flight.area.name}</p>
                                <p className='card-text'>{t.d['flight_obj_drone']}: {flight.drone.name}</p>   
                                <p className='card-text'>{t.d['flight_obj_interval']}: {interval}</p>   
                                <p className='card-text'>{t.d['flight_obj_time']}: {flight.time}</p>
                                <p className='card-text'>{t.d['flight_obj_status']}: {flight.active === true ? (<><span className='font-weight-bold' style={{color:"green"}}>{t.d['flight_active_on']}</span><span> ({next_flight})</span></>) : (<span  className='font-weight-bold' style={{color:"red"}}>{t.d['flight_active_off']}</span>)}</p>   
                            </div>
                        </div>
                    </div>
                </li>
            )
        })

        let fieldOptions = this.state.areas.map(field => {
            return <option key={field.id} label={field.name} value={field.id}/>
        })
        let droneOptions = this.state.drones.map(drone => {
            return <option key={drone.id} label={drone.name} value={drone.id}/>
        })
    

        if (flights.length === 0) {
            flights = (
                <div className='row'>
                    <div className='col-12'>
                        <div className='card text-center text-white bg-info'>
                            <div className='card-body'>
                                <h6 className='card-title'>{t.d['no_flights']}</h6>
                                <p className='card-text'>{t.d['no_flights2']}<br/>{t.d['no_flights3']}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-9'>
                        <div className='container'>
                            <ul className="list-group list-group-horizontal">
                                <li className='col-4 list-group-item'><Link to="/account/drones">{t.d['drones']}</Link></li>
                                <li className='col-4 list-group-item'><Link to="/account/areas">{t.d['fields']}</Link></li>
                                <li className='col-4 list-group-item active'><Link to="/account/flights">{t.d['flights']}</Link></li>
                            </ul>
                            <div className='row' style={{marginBottom: "30px", marginTop: "30px"}}>
                                <div className='col-12'>
                                    <this.ModalAdd/>
                                    <this.ModalEdit/>
                                    <this.ModalInfo/>
                                    <this.ModalDelete/>
                                </div>
                            </div>
                                {this.state.isLoading === true ? ("") : (
                                    <div>{flights}</div>
                                )}
                        </div>
                    </div>
                <div className='col-1'></div>
                <div className='col-2' style={{padding: "0px"}}>
                    <div>
                        <h4>{t.d['filter']}{this.state.filterCounter !== undefined && (<> <span className='badge badge-secondary'>{this.state.filterCounter}</span></>)}</h4>
                        <hr/>
                        <form onSubmit={this.handleFilter} onReset={this.handleResetFilter}>
                            <div className='form-group'>
                                <label>{t.d['name']}</label>
                                <input
                                    className="form-control"
                                    type='text'
                                    placeholder={t.d['name']}
                                    value={this.state.filterName}
                                    name='filterName'
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label>{t.d['field']}</label>
                                <select value={this.state.filterAreaId} name='filterAreaId' onChange={this.handleChange} className='form-control'>
                                    <option value={-1} label={t.d['not_selected']}/>
                                    {fieldOptions}
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>{t.d['drone']}</label>
                                <select value={this.state.filterDroneId} name='filterDroneId' onChange={this.handleChange} className='form-control'>
                                    <option value={-1} label={t.d['not_selected']}/>
                                    {droneOptions}
                                </select>
                            </div>
                            <div className='form-check'>
                                <input
                                    className='form-check-input'
                                    type='checkbox'
                                    onChange={this.handleChange}
                                    name='filterActive'
                                    checked={this.state.filterActive}
                                />
                                <label className='firm-check-label'>{t.d['active']}</label>
                            </div>
                            <button className='btn btn-primary btn-sm' type='submit'>{t.d['apply']}</button>
                            <button className='btn btn-info btn-sm' style={{marginLeft: "10px"}} type='reset'>{t.d['reset']}</button>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}