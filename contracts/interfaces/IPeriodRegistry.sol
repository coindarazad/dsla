// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

interface IPeriodRegistry {
    enum PeriodType {
        Hourly,
        Daily,
        Weekly,
        BiWeekly,
        Monthly,
        Yearly
    }

    function getPeriodStartAndEnd(PeriodType _periodType, uint256 _periodId)
        external
        view
        returns (uint256, uint256);

    function isValidPeriod(PeriodType _periodType, uint256 _periodId)
        external
        view
        returns (bool);

    function isInitializedPeriod(PeriodType _periodType)
        external
        view
        returns (bool);

    function periodHasStarted(PeriodType _periodType, uint256 _periodId)
        external
        view
        returns (bool);

    function periodIsFinished(PeriodType _periodType, uint256 _periodId)
        external
        view
        returns (bool);
}
