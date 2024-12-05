import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Dashboard from "../pages/Dashboard";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Dashboard">
                <Dashboard/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews