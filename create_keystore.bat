@echo off
echo Creating keystore for ShopList app...
keytool -genkeypair -v -keystore android/app/shoplist-release-key.keystore -alias shoplist-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass shoplist123 -keypass shoplist123 -dname "CN=ShopList, OU=Mobile, O=ShopList, L=City, S=State, C=US"
echo Keystore created successfully!
