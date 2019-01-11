pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./Compensatable.sol";
import "./Subscribable.sol";
import "../Whitelist/Whitelist.sol";
import "../SLO/SLO.sol";

contract SLA is Ownable, Compensatable, Subscribable {

    IERC20 public dsla;

    struct SLI {
        uint timestamp;
        uint value;
        string ipfsHash;
    }

    mapping(bytes32 => SLO) public SLOs;
    mapping(bytes32 => SLI[]) public SLIs;

    constructor(
        address _owner,
        Whitelist _whitelist,
        IERC20 _dsla,
        bytes32[] memory _SLONames,
        SLO[] memory _SLOs,
        uint _compensationAmount
    )
    public {
        require(_SLOs.length < 5);
        require(_SLONames.length == _SLOs.length);

        for(uint i = 0; i < _SLOs.length; i++) {
            SLOs[_SLONames[i]] = _SLOs[i];
        }

        transferOwnership(_owner);
        whitelist = _whitelist;
        dsla = _dsla;
        compensationAmount = _compensationAmount;
    }

    function registerSLI(bytes32 _SLOName, uint _value, string calldata _hash)
        external
        onlyOwner
    {
        SLIs[_SLOName].push(SLI(now, _value, _hash));

        if(!SLOs[_SLOName].isSLOHonored(_value)) {
            _compensate();
        }
    }

    function changeWhitelist(Whitelist _newWhitelist) external onlyOwner {
        whitelist = _newWhitelist;
    }

    function signAgreement() external {
        _subscribe();
        _setInitialuserCompensation();
    }

    function withdrawCompensation() external onlySubscribed {
        _withdrawCompensation();
    }
}
