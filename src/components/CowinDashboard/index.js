import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loader: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'Failure',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    cowinData: {},
  }

  componentDidMount() {
    this.getCowinData()
  }

  getCowinData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          oneDay => ({
            vaccineDate: oneDay.vaccine_date,
            dose1: oneDay.dose_1,
            dose2: oneDay.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(byAge => ({
          age: byAge.age,
          count: byAge.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          byGender => ({
            count: byGender.count,
            gender: byGender.gender,
          }),
        ),
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        cowinData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <h1>CoWIN vaccine in India</h1>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {cowinData} = this.state
    const {
      vaccinationByAge,
      vaccinationByGender,
      last7DaysVaccination,
    } = cowinData

    return (
      <>
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </>
    )
  }

  renderAllVaccination = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="style">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1>co-WIN</h1>
        </div>
        <h1>coWIN vaccination in india</h1>
        {this.renderAllVaccination()}
      </div>
    )
  }
}

export default CowinDashboard
