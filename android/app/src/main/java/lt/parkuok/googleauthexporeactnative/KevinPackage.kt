package lt.parkuok.googleauthexporeactnative

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
// import lt.parkuok.googleauthexporeactnative.KevinModule

class KevinPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {
        val modules: MutableList<NativeModule> = java.util.ArrayList<NativeModule>()
        modules.add(KevinModule(reactContext))
        return modules
    }
}