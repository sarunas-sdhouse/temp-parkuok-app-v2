package lt.parkuok.googleauthexporeactnative

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.ActivityEventListener
import android.app.Activity
import android.content.Intent
import java.util.Locale
// KEVIN SDK
import eu.kevin.android.Kevin
import eu.kevin.android.KevinAccountsPlugin
import eu.kevin.android.KevinAccountsConfiguration
import eu.kevin.android.KevinPaymentsPlugin
import eu.kevin.android.KevinPaymentsConfiguration
import eu.kevin.android.AccountSessionConfiguration
import eu.kevin.android.KevinCountry
import eu.kevin.android.AccountSessionActivity
import eu.kevin.android.AccountSessionContract
import eu.kevin.android.SessionResult
import eu.kevin.android.AccountSessionResult
import eu.kevin.android.PaymentSessionConfiguration
import eu.kevin.android.PaymentType
import eu.kevin.android.PaymentSessionActivity
import eu.kevin.android.PaymentSessionContract
import eu.kevin.android.PaymentSessionResult

class KevinModule internal constructor(context: ReactApplicationContext?) :
    ReactContextBaseJavaModule(context), ActivityEventListener {

    private var callback: Callback? = null

    init {
        context?.addActivityEventListener(this)
        
        // Setup your custom theme which extends Theme.Kevin.Base
        Kevin.setTheme(R.style.Theme_Kevin_Base)
        // Set optional locale, default is phone locale
        Kevin.setLocale(Locale("en"))
        // Initialize required plugins with your callback urls
        Kevin.setDeepLinkingEnabled(true)
        KevinAccountsPlugin.configure(
            KevinAccountsConfiguration.builder()
                .setCallbackUrl("kevin://redirect.authorization")
                .build()
        )
        KevinPaymentsPlugin.configure(
            KevinPaymentsConfiguration.builder()
                .setCallbackUrl("kevin://redirect.payment")
                .build()
        )
    }

    @ReactMethod
    fun openKevinAccountLinking(state: String, callback: Callback) {
        try {
            val accountLinkingConfiguration = AccountSessionConfiguration.Builder(state)
                .setPreselectedCountry(KevinCountry.LITHUANIA)
                .build()
            val intent = Intent(currentActivity, AccountSessionActivity::class.java)
            intent.putExtra(AccountSessionContract.CONFIGURATION_KEY, accountLinkingConfiguration)
            currentActivity?.startActivityForResult(intent, REQUEST_CODE_ACCOUNT_LINKING, null)
            this.callback = callback
        } catch (error: Exception) {
            callback("Failed", null)
        }
    }
    
    companion object {
        const val REQUEST_CODE_ACCOUNT_LINKING = 100
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode == REQUEST_CODE_ACCOUNT_LINKING) {
            val result = data?.getParcelableExtra<SessionResult<AccountSessionResult>>(AccountSessionContract.RESULT_KEY)
            when (result) {
                is SessionResult.Success -> {
                    callback?.invoke(null, result.value.authorizationCode)
                }
                is SessionResult.Canceled -> {
                    callback?.invoke("Canceled", null)
                }
                is SessionResult.Failure -> {
                    callback?.invoke("Failed", null)
                }
            }
        }

        if (requestCode == REQUEST_CODE_PAYMENT) {
            val result = data?.getParcelableExtra<SessionResult<PaymentSessionResult>>(PaymentSessionContract.RESULT_KEY)
            when (result) {
                is SessionResult.Success -> {
                    callback?.invoke(null, result.value.paymentId)
                }
                is SessionResult.Canceled -> {
                    callback?.invoke("Canceled", null)
                }
                is SessionResult.Failure -> {
                    callback?.invoke("Failed", null)
                }
            }
        }
    }

    @ReactMethod
    fun openKevinBankPayment(state: String, callback: Callback) {
        try {
            val paymentConfiguration = PaymentSessionConfiguration.Builder(id)
                .setPaymentType(PaymentType.BANK)
                .setPreselectedCountry(KevinCountry.LITHUANIA)
                .build()
            val intent = Intent(currentActivity, PaymentSessionActivity::class.java)
            intent.putExtra(PaymentSessionContract.CONFIGURATION_KEY, paymentConfiguration)
            currentActivity?.startActivityForResult(intent, REQUEST_CODE_PAYMENT, null)
            this.callback = callback
        } catch (error: Exception) {
            callback("Failed", null)
        }
    }
    
    companion object {
        const val REQUEST_CODE_PAYMENT = 101
    }
}