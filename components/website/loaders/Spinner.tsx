import { FadeLoader } from 'react-spinners'

const Spinner = ({ loading }: { loading: boolean }) => {
  return (
    <div className="flex justify-center items-center">
      <FadeLoader color={'#069769'} loading={loading} aria-label="Loading Spinner" />
    </div>
  )
}

export default Spinner
