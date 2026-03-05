import './App.css'
import { LeftDrawer } from './LeftDrawer'
import { Banner } from './Banner'
import { View } from './View'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftDrawer />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Banner />
        <View />
      </div>
    </div>
  )
}

export default App
