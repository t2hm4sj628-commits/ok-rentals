import AnalyticsSettingsTypes "../types/analytics-settings";

module {
  public type AnalyticsSettingsState = {
    var settings : AnalyticsSettingsTypes.AnalyticsSettings;
  };

  public let defaultSettings : AnalyticsSettingsTypes.AnalyticsSettings = {
    ga4Id = "";
    metaPixelId = "";
    tiktokPixelId = "";
  };

  public func getAnalyticsSettings(state : AnalyticsSettingsState) : AnalyticsSettingsTypes.AnalyticsSettings {
    state.settings;
  };

  public func setAnalyticsSettings(
    state : AnalyticsSettingsState,
    settings : AnalyticsSettingsTypes.AnalyticsSettings
  ) : () {
    state.settings := settings;
  };
};
