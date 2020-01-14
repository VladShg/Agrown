import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap'

export default class Drones extends Component {
    constructor(props) {
        super(props)

        this.handleChange =         this.handleChange.bind(this)
        this.handleFilter =         this.handleFilter.bind(this)
        this.handleResetFilter =    this.handleResetFilter.bind(this)
        this.fetchDrones =          this.fetchDrones.bind(this)
        this.ModalAdd =             this.ModalAdd.bind(this)
        this.ModalInfo =            this.ModalInfo.bind(this)
        this.ModalEdit =            this.ModalEdit.bind(this)
        this.ModalDelete =          this.ModalDelete.bind(this)
        this.handleCallDelete =     this.handleCallDelete.bind(this)
        this.handleCallEdit =       this.handleCallEdit.bind(this)

        this.fetchDrones()

        this.state = {
            isLoading: true,
            allDrones: [],
            drones: [],
            models: [],
            
            modalError: '',
            modalMessage: '',
            name: '',
            model: '',
            code: '',
            
            filterName: '',
            filterModelId: -1,
            filterSync: false,
            filterCounter: null,

            modalDeleteOpen: false,
            deleteName: "",
            deleteId: '',

            modalAddOpen: false,

            modalInfoOpen: false,

            modalEditOpen: false,
            editId: '',
            editName: '',
            editModelId: -1,
            editCode: '',
            editMessage: '',
            editError: ''
        }
    }

    fetchDrones() {
        let obj = {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
            'Content-Type': 'application/json',
            },
            redirect: 'follow', 
            referrer: 'no-referrer',
            body: JSON.stringify({
                'token': this.props.token
            })
        }
        fetch(`${this.props.proxy}/api/drones`, obj)
            .then(r =>  r.json()
            .then(data => ({status: r.status, body: data})))
            .then(obj => {
                if (obj.status === 401) {
                    this.props.onTokenChange("")
                }
                else {
                this.setState({
                    allDrones: obj.body,
                    drones: obj.body
                })
            }
        })
        obj = {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            redirect: 'follow', 
            referrer: 'no-referrer'
        }
        fetch(`${this.props.proxy}/api/models`, obj)
            .then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(obj => {
                this.setState({
                    models: obj.body,
                    isLoading: false
                })
            })
    }

    handleChange(event) {
        if (event.target.name === 'filterSync')
            this.setState({[event.target.name]: !this.state.filterSync})
        else
            this.setState({
                [event.target.name]: event.target.value
            })
    }

    handleFilter(event) {
        event.preventDefault()

        let drones_obj = this.state.allDrones
        let drones = []
        for (let i = 0; i < drones_obj.length; i++) {
            let drone = drones_obj[i]
            if (this.state.filterName !== '')
                if (drone.name.indexOf(this.state.filterName) === -1)
                    continue
            if (Number.parseInt(this.state.filterModelId) !== -1)
                if (drone.model.id !== Number.parseInt(this.state.filterModelId))
                    continue
            drones.push(drone)
        }
        this.setState({
            drones: drones,
            filterCounter: drones.length
        })
    }

    handleResetFilter(event) {
        event.preventDefault()


        this.setState({
            filterName: '',
            filterModelId: -1,
            filterCode: '',
            filterSync: false,
            drones: this.state.allDrones,
            filterCounter: null
        })
    }

    handleCallEdit(drone) {
        this.setState({
            modalEditOpen: true,
            editId: drone.id,
            editName: drone.name,
            editCode: drone.code,
            editModelId: drone.model.id,
            editMessage: '',
            editError: ''
        })
    }

    handleCallDelete(drone) {
        this.setState({
            deleteId: drone.id,
            deleteName: drone.name,
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
                    name: this.state.deleteId,
                    token: this.props.token,
                    id: this.state.deleteId
                })
            }
            fetch(`${this.props.proxy}/api/delete_drone`, obj)
            .then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    if (data.body.error === 'delete forbidden')
                        this.setState({modalInfoOpen: true, modalMessage: this.state.dict.d['drone_delete_forbidden'], modalDeleteOpen: false})
                    else
                        this.setState({modalInfoOpen: true, modalMessage: this.state.dict.d['drone_delete_error'], modalDeleteOpen: false})
                } else {
                    this.setState({modalDeleteOpen: false})
                    this.fetchDrones()
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
                editCode: '',
                editModelId: -1,
                editMessage: '',
                editError: ''
            })
        }
        let handleEdit = (event) => {
            event.preventDefault()
            if (Number.parseInt(this.state.editModelId) === -1) {
                this.setState({
                    editError: this.props.dict.d['model_empty']
                })
                return
            }
            let obj = {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'token': this.props.token,
                    'name': this.state.editName,
                    'model_id': this.state.editModelId,
                    'code': this.state.editCode,
                    'id': this.state.editId
                })
            }
            fetch(`${this.props.proxy}/api/update_drone`, obj).then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    if (data.body.error === 'duplicate code')
                        this.setState({
                            editError: this.props.dict.d['code_occupied']
                        })
                } else {
                    this.setState({
                        modalEditOpen: false,
                        modalInfoOpen: true,
                        modalMessage: this.props.dict.d['info_updated']
                    })
                    this.fetchDrones()
                }
            })
        }
        let modelOptions = this.state.models.map(model => {
            return <option key={model.id} label={model.name} value={model.id}/>
        })

        
        const t = this.props.dict
        return (
          <>
            <Modal centered show={this.state.modalEditOpen} onHide={handleClose}>
              <form onSubmit={handleEdit}>
              <Modal.Header closeButton>
                <Modal.Title>{t.d['edit_drone']}</Modal.Title>
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
                                pattern="^[^\s]*$"
                                required
                            />
                            <small>{t.d['drone_name']}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['model']}</label>
                            <select value={this.state.editModelId} name='editModelId' onChange={this.handleChange} className='form-control'>
                                    <option value={-1} label={t.d['not_selected']}/>
                                    {modelOptions}
                            </select>
                            <small>{t.d['drone_model']}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['code']}</label>
                            <input 
                                className='form-control' 
                                pattern="^[0-9]*$"
                                name='editCode'
                                placeholder={t.d['code']}
                                type='text'
                                value={this.state.editCode}
                                onChange={this.handleChange}
                                required
                            />
                            <small>{t.d['drone_code']}</small>
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
        )
    }

    ModalInfo() {
        const handleClose = () => {
            this.setState({
                modalInfoOpen: false
            })
        }
        return (
            <>
                <Modal
                    centered
                    size='sm'
                    show={this.state.modalInfoOpen}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        {this.props.dict.d['info']}
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalMessage}
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    ModalAdd() {
        const handleClose = () => this.setState({modalAddOpen: false});
        const handleShow = () => this.setState({modalAddOpen: true});
        const handleAdd = (event) => {
            event.preventDefault()
            
            if (Number.parseInt(this.state.modelId) === -1) {
                this.setState({
                    modalError: this.props.dict.d['model_empty']
                })
                return
            }

            let obj = {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    model_id: this.state.modelId,
                    code: this.state.code,
                    token: this.props.token
                })
            }
            fetch(`${this.props.proxy}/api/add_drone`, obj)
            .then(r => r.json().then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    if (data.body.error === 'duplicate code')
                        this.setState({modalError: this.props.dict.d['code_occupied']})
                    else 
                        this.setState({modalError: data.body.error})
                } else {
                    this.setState({
                        modalMessage: this.props.dict.d['drone_added'],
                        modalInfoOpen: true, 
                        modalAddOpen: false,
                        name: '',
                        code: '',
                        modelId: -1
                    })
                    this.fetchDrones()
                }
            })
        }
        
        let modelOptions = this.state.models.map(model => {
            return <option key={model.id} label={model.name} value={model.id}/>
        })

        const t = this.props.dict
        return (
          <>
            <button onClick={handleShow} type='button' data-toggle="modal" data-target="#addModal" className='btn btn-outline-primary btn-lg btn-block'>{t.d['add']}</button>
      
            <Modal centered show={this.state.modalAddOpen} onHide={handleClose}>
              <form onSubmit={handleAdd}>
              <Modal.Header closeButton>
                <Modal.Title>{t.d['add_drone']}</Modal.Title>
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
                            <small>{t.d['drone_name']}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['model']}</label>
                            <select value={this.state.modelId} name='modelId' onChange={this.handleChange} className='form-control'>
                                    <option value={-1} label={t.d['not_selected']}/>
                                    {modelOptions}
                            </select>
                            <small>{t.d['drone_model']}</small>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['code']}</label>
                            <input 
                                className='form-control' 
                                pattern="^[0-9]*$"
                                name='code'
                                placeholder={t.d['code']}
                                type='text'
                                value={this.state.code}
                                onChange={this.handleChange}
                                required
                            />
                            <small>{t.d['drone_code_add']}</small>
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

    render() {
        const t = this.props.dict
        let modelOptions = this.state.models.map(model => {
            return <option key={model.id} label={model.name} value={model.id}/>
        })
        if (this.props.token === "")
            return (
                <Redirect to="/login"/>
            )
        let drones_obj = this.state.drones
        let drones = drones_obj.map(drone => {
            return (
                <li key={drone.id} className='row' style={{marginBottom: "30px"}}>
                    <div className='col-12'>
                        <div className='card text-left' style={{paddingRight: "0px"}}>
                                <div className='card-header'>
                                <div className='row'>
                                    <div className='col-10'>
                                        <h5>{drone.name}#{drone.code}</h5>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallEdit(drone)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['edit']}>
                                            <img alt={t.d['Edit']} style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/edit-icon.png'}></img>
                                        </button>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallDelete(drone)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['delete']}>
                                            <img alt={t.d['Delete']} style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/delete-icon.png'}></img>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p className='card-text'>{t.d['model']}: {drone.model.name}</p>
                                <p className='card-text'>{t.d['status']}: {drone.sync === true ? (
                                    <span style={{color: 'green'}}>{t.d['synced_off']}</span>
                                ) : (
                                    <span style={{color: 'red'}}>{t.d['synced_on']}{drone.last_synced !== null && <> ({t.d['last_update']}: )</>}</span>
                                )}</p>   
                            </div>
                        </div>
                    </div>
                </li>
            )
        })

        if (drones.length === 0) {
            drones = (
                <div className='row'>
                    <div className='col-12'>
                        <div className='card text-center text-white bg-info'>
                            <div className='card-body'>
                                <h6 className='card-title'>{t.d['no_drones']}</h6>
                                <p className='card-text'>{t.d['no_drones2']}</p>
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
                                <li className='col-4 list-group-item active'><Link to="/account/drones">{t.d['drones']}</Link></li>
                                <li className='col-4 list-group-item'><Link to="/account/areas">{t.d['fields']}</Link></li>
                                <li className='col-4 list-group-item'><Link to="/account/flights">{t.d['flights']}</Link></li>
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
                                    <div>{drones}</div>
                                )}
                        </div>
                    </div>
                <div className='col-1'></div>
                <div className='col-2' style={{padding: "0px"}}>
                    <div>
                        <h4>{t.d['filter']}{this.state.filterCounter !== null && (<> <span className='badge badge-secondary'>{this.state.filterCounter}</span></>)}</h4>
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
                                <label>{t.d['model']}</label>
                                <select value={this.state.filterModelId} name='filterModelId' onChange={this.handleChange} className='form-control'>
                                        <option value={-1} label={t.d['not_selected']}/>
                                        {modelOptions}
                                </select>
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