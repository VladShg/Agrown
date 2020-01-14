import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Button, Modal} from 'react-bootstrap'
import FieldMap from './maps/FieldMap'
import CollapsableMap from './maps/CollapsableMap'

export default class Drones extends Component {
    constructor(props) {
        super(props)

        this.handleChange =         this.handleChange.bind(this)
        this.handleFilter =         this.handleFilter.bind(this)
        this.handleResetFilter =    this.handleResetFilter.bind(this)
        this.fetchAreas =           this.fetchAreas.bind(this)
        this.ModalAdd =             this.ModalAdd.bind(this)
        this.ModalInfo =            this.ModalInfo.bind(this)
        this.ModalEdit =            this.ModalEdit.bind(this)
        this.ModalDelete =          this.ModalDelete.bind(this)
        this.handleCallDelete =     this.handleCallDelete.bind(this)
        this.handleCallEdit =       this.handleCallEdit.bind(this)

        this.fetchAreas()

        this.state = {
            isLoading: true,
            allAreas: [],
            areas:[],
            
            modalError: '',
            modalMessage: '',

            name: '',
            crops: '',
            points: [],
            square: null,
            
            filterName: '',
            filterModel: '',
            filterCounter: null,

            modalDeleteOpen: false,
            deleteName: "",
            deleteId: '',

            modalAddOpen: false,

            modalInfoOpen: false,

            modalEditOpen: false,
            editId: '',
            editName: '',
            editCrops: '',
            editPoints: '',
            editSquare: '',
            editMessage: '',
            editError: ''
        }
    }

    fetchAreas() {
        let obj = {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token
            })
        }
        fetch(`${this.props.proxy}/api/areas`, obj)
            .then(r =>  r.json()
            .then(data => ({status: r.status, body: data})))
            .then(obj => {
                if (obj.status === 401) {
                    this.props.onTokenChange("")
                }
                else {
                this.setState({
                    isLoading: false,
                    allAreas: obj.body,
                    areas: obj.body
                })
            }
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleFilter(event) {
        event.preventDefault()

        let areas_obj = this.state.allAreas
        let areas = []
        for (let i = 0; i < areas_obj.length; i++) {
            let area = areas_obj[i]
            if (this.state.filterName !== '')
                if (area.name.indexOf(this.state.filterName) === -1)
                    continue
            if (this.state.filterCrops !== '')
                if (area.crops_type.indexOf(this.state.filterCrops) === -1)
                    continue
            areas.push(area)
        }
        this.setState({
            areas: areas,
            filterCounter: areas.length
        })
    }

    handleResetFilter(event) {
        event.preventDefault()


        this.setState({
            filterName: '',
            filterCrops: '',
            areas: this.state.allAreas,
            filterCounter: null
        })
    }

    handleCallEdit(area) {
        this.setState({
            modalEditOpen: true,
            editId: area.id,
            editName: area.name,
            editCrops: area.crops_type,
            editSquare: area.square,
            editPoints: area.points,
            editMessage: '',
            editError: ''
        })
    }

    handleCallDelete(area) {
        this.setState({
            deleteId: area.id,
            deleteName: area.name,
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
            fetch(`${this.props.proxy}/api/delete_area`, obj)
            .then(r => r.json()
            .then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    if (data.body.error === 'delete forbidden')
                        this.setState({modalInfoOpen: true, modalMessage: this.props.dict.d['area_delete_error'], modalDeleteOpen: false})
                    else
                        this.setState({modalInfoOpen: true, modalMessage: data.body.error, modalDeleteOpen: false})
                } else {
                    this.setState({modalDeleteOpen: false})
                    this.fetchAreas()
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
                editCrops: '',
                editSquare: null,
                editPoints: [],
                editMessage: '',
                editError: ''
            })
        }
        let handleEdit = (event) => {
            event.preventDefault()

            if (this.state.editPoints.length === 0) {
                this.setState({
                    editError: this.props.dict.d['area_not_selected']
                })
                return
            }

            if (Math.ceil(Number.parseFloat(this.state.editSquare)) === 0) {
                this.setState({
                    editError: this.props.dict.d['area_empty']
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
                    'crops_type': this.state.editCrops,
                    'square': this.state.editSquare,
                    'points': this.state.editPoints,
                    'id': this.state.editId
                })
            }
            fetch(`${this.props.proxy}/api/update_area`, obj).then(r => r.json()
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
                        modalMessage: 'Information updated',
                        isLoading: true,
                        editId: null,
                        editName: '',
                        editCrops: '',
                        editSquare: null,
                        editPoints: []
                    })
                    this.fetchAreas()
                }
            })
        }

        const t = this.props.dict
        return (
            <>
              <Modal centered show={this.state.modalEditOpen} onHide={handleClose}>
                <form onSubmit={handleEdit}>
                <Modal.Header closeButton>
                  <Modal.Title>{t.d['add_field']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                          {this.state.editError !== '' && (
                              <div id='editError' className='alert alert-danger'>
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
                              <small>{t.d['field_name']}</small>
                          </div>
                          <div className='map'>
                          </div>
                          <div className='form-group'>
                              <label>{t.d['crops']}</label>
                              <input 
                                  className='form-control' 
                                  name='editCrops'
                                  placeholder={t.d['crops']}
                                  type='text'
                                  value={this.state.editCrops}
                                  onChange={this.handleChange}
                                  pattern='^[^\s]*$'
                                  required
                              />
                              <small>{t.d['field_crops']}</small>
                          </div>
                          <div className='form-group' style={{height: '50vh', width: '100%'}}>
                              <label>{t.d['select_area']}</label>
                              <FieldMap
                                  {...this.props}
                                  name={this.state.editName}
                                  readonly={false}
                                  dict={this.props.dict}
                                  points={this.state.editPoints}
                                  onPolyComplete={(pointArray, square) => {this.setState({editPoints: pointArray, editSquare: square})}}
                              />
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
            if (this.state.points.length === 0) {
                this.setState({
                    modalError: this.props.dict.d['area_not_selected']
                })
                return
            }
            
            if (Math.ceil(Number.parseFloat(this.state.square)) === 0) {
                this.setState({
                    modalError: this.props.dict.d['area_empty']
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
                    crops_type: this.state.crops,
                    square: this.state.square,
                    points: this.state.points,
                    token: this.props.token
                })
            }
            fetch(`${this.props.proxy}/api/add_area`, obj)
            .then(r => r.json().then(data => ({status: r.status, body: data})))
            .then(data => {
                if (data.status === 400) {
                    this.setState({modalError: data.body.error})
                } else {    
                    this.setState({
                        modalMessage: this.props.dict.d['field_added'],
                        modalInfoOpen: true, 
                        modalAddOpen: false,
                        name: '',
                        crops: '',
                        square: null,
                        points: [],
                        isLoading: true
                    })
                    this.fetchAreas()
                }
            })
        }
      
        const t = this.props.dict
        return (
          <>
            <button onClick={handleShow} type='button' data-toggle="modal" data-target="#addModal" className='btn btn-outline-primary btn-lg btn-block'>{t.d['add']}</button>
      
            <Modal centered show={this.state.modalAddOpen} onHide={handleClose}>
              <form onSubmit={handleAdd}>
              <Modal.Header closeButton>
                <Modal.Title>{t.d['add_field']}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                        {this.state.modalError !== '' && (
                            <div id='modalError' className='alert alert-danger'>
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
                            <small>{t.d['field_name']}</small>
                        </div>
                        <div className='map'>
                        </div>
                        <div className='form-group'>
                            <label>{t.d['crops']}</label>
                            <input 
                                className='form-control' 
                                name='crops'
                                placeholder={t.d['crops']}
                                type='text'
                                value={this.state.crops}
                                onChange={this.handleChange}
                                pattern='^[^\s]*$'
                                required
                            />
                            <small>{t.d['field_crops']}</small>
                        </div>
                        <div className='form-group' style={{height: '50vh', width: '100%'}}>
                            <label>{t.d['select_area']}</label>
                            <FieldMap
                                {...this.props}
                                name={this.state.name}
                                points={this.state.points}
                                dict={this.props.dict}
                                readonly={false}
                                onPolyComplete={(pointArray, square) => {this.setState({points: pointArray, square: square})}}
                            />
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
        if (this.props.token === "")
            return (
                <Redirect to="/login"/>
            )
        let areas_obj = this.state.areas
        let areas = areas_obj.map(area => {
            return (
                <li key={area.id} className='row' style={{marginBottom: "30px"}}>
                    <div className='col-12'>
                        <div className='card text-left' style={{paddingRight: "0px"}}>
                                <div className='card-header'>
                                <div className='row'>
                                    <div className='col-10'>
                                        <h5>{area.name}</h5>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallEdit(area)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['edit']}>
                                            <img alt='Edit' style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/edit-icon.png'}></img>
                                        </button>
                                    </div>
                                    <div className='col-1'>
                                        <button onClick={() => this.handleCallDelete(area)} className='btn btn-light' data-toggle="tooltip" data-placement="bottom" title={t.d['delete']}>
                                            <img alt='Delete' style={{width: "20px", height: '20px'}} src={process.env.PUBLIC_URL + '/delete-icon.png'}></img>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='card-body'>
                                <p>{t.d['crps']}: {area.crops_type}</p>
                                <p>{t.d['field_area']}: {area.square > 1000000 ? (Math.round(100*area.square/1000000)/100).toString() + " km²" : (Math.round(area.square*100)/100).toString() + " m²"}</p>
                                <CollapsableMap 
                                    {...this.props}
                                    id={area.id}
                                    name={area.name}
                                    points={area.points}
                                    dict={this.props.dict}
                                />
                            </div>
                        </div>
                    </div>
                </li>
            )
        })

        if (areas.length === 0) {
            areas = (
                <div className='row'>
                    <div className='col-12'>
                        <div className='card text-center text-white bg-info'>
                            <div className='card-body'>
                                <h6 className='card-title'>{t.d['no_fields']}</h6>
                                <p className='card-text'>{t.d['no_fields2']}</p>
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
                                <li className='col-4 list-group-item active'><Link to="/account/areas">{t.d['fields']}</Link></li>
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
                                    <div>{areas}</div>
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
                                <label>{t.d['crps']}</label>
                                <input
                                    className="form-control"
                                    type='text'
                                    placeholder={t.d['crps']}
                                    value={this.state.filterCrops}
                                    name='filterCrops'
                                    onChange={this.handleChange}
                                />
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