package lt.parkuok.googleauthexporeactnative

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import eu.kevin.accounts.KevinAccountsConfiguration
import eu.kevin.accounts.KevinAccountsPlugin
import eu.kevin.accounts.accountsession.AccountSessionActivity
import eu.kevin.accounts.accountsession.AccountSessionContract
import eu.kevin.accounts.accountsession.AccountSessionResult
import eu.kevin.accounts.accountsession.entities.AccountSessionConfiguration
import eu.kevin.core.entities.SessionResult
import eu.kevin.core.enums.KevinCountry
import eu.kevin.core.plugin.Kevin
import eu.kevin.inapppayments.KevinPaymentsConfiguration
import eu.kevin.inapppayments.KevinPaymentsPlugin
import eu.kevin.inapppayments.paymentsession.PaymentSessionActivity
import eu.kevin.inapppayments.paymentsession.PaymentSessionContract
import eu.kevin.inapppayments.paymentsession.PaymentSessionResult
import eu.kevin.inapppayments.paymentsession.entities.PaymentSessionConfiguration
import eu.kevin.inapppayments.paymentsession.enums.PaymentType
import java.util.Locale

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
                else -> {}
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
                else -> {}
            }
        }
    }

    override fun onNewIntent(p0: Intent?) {

    }

    @ReactMethod
    fun openKevinBankPayment(state: String, callback: Callback) {
        try {
            val paymentConfiguration = PaymentSessionConfiguration.Builder(state)
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
        const val REQUEST_CODE_ACCOUNT_LINKING = 100
    }

    override fun getName(): String {
        return "something"
    }
}