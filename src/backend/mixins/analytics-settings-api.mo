import AnalyticsSettingsLib "../lib/analytics-settings";
import AnalyticsSettingsTypes "../types/analytics-settings";
import AdminLib "../lib/admin";

mixin (
  analyticsSettingsState : AnalyticsSettingsLib.AnalyticsSettingsState,
  admins : AdminLib.AdminSet
) {
  public query func getAnalyticsSettings() : async AnalyticsSettingsTypes.AnalyticsSettings {
    AnalyticsSettingsLib.getAnalyticsSettings(analyticsSettingsState);
  };

  public shared ({ caller }) func adminSetAnalyticsSettings(
    settings : AnalyticsSettingsTypes.AnalyticsSettings
  ) : async { #ok; #err : Text } {
    if (not AdminLib.isAdmin(admins, caller)) {
      return #err "Not authorized";
    };
    AnalyticsSettingsLib.setAnalyticsSettings(analyticsSettingsState, settings);
    #ok;
  };
};
