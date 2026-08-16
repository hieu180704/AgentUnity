# Recipe: Unit Testing & Test-Driven Development (TDD)

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern (EditMode NUnit Test)](#2-standard-code-pattern-editmode-nunit-test)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Kiểm thử tự động các logic thuần (Game Math, Công thức sát thương, Thuật toán tính điểm, Save/Load serialization, State Machine transitions, Inventory stacking).
- **Khi nào KHÔNG áp dụng:** Kiểm tra hiệu ứng hình ảnh VFX hoặc trải nghiệm thị giác (cần play-test thủ công hoặc screenshot).

---

# 2. Standard Code Pattern (EditMode NUnit Test)

```csharp
using NUnit.Framework;
using UnityEngine;
using MyGame.Core;

namespace MyGame.Tests.EditMode {
    public class PlayerHealthTests {
        private HealthSystem healthSystem;

        [SetUp]
        public void SetUp() {
            // Khởi tạo trạng thái mới trước mỗi test case
            healthSystem = new HealthSystem(maxHealth: 100);
        }

        [TearDown]
        public void TearDown() {
            // Dọn dẹp tài nguyên sau mỗi test case
            healthSystem = null;
        }

        [Test]
        public void TakeDamage_WhenDamageIsPositive_ShouldReduceHealth() {
            // Arrange
            int damage = 30;

            // Act
            healthSystem.TakeDamage(damage);

            // Assert
            Assert.AreEqual(70, healthSystem.CurrentHealth, "Máu phải giảm đúng bằng lượng sát thương nhận vào.");
            Assert.IsFalse(healthSystem.IsDead, "Nhân vật không được chết khi máu còn > 0.");
        }

        [Test]
        public void TakeDamage_WhenDamageExceedsCurrentHealth_ShouldClampToZeroAndDie() {
            // Arrange
            int fatalDamage = 150;

            // Act
            healthSystem.TakeDamage(fatalDamage);

            // Assert
            Assert.AreEqual(0, healthSystem.CurrentHealth, "Máu không được âm, phải clamp về 0.");
            Assert.IsTrue(healthSystem.IsDead, "Trạng thái IsDead phải là true.");
        }

        [TestCase(0)]
        [TestCase(-10)]
        public void TakeDamage_WhenDamageIsZeroOrNegative_ShouldIgnore(int invalidDamage) {
            // Act
            healthSystem.TakeDamage(invalidDamage);

            // Assert
            Assert.AreEqual(100, healthSystem.CurrentHealth, "Sát thương <= 0 không được làm thay đổi máu.");
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Cấu trúc Đặt tên Test:** `MethodName_WhenCondition_ShouldExpectedResult` (VD: `TakeDamage_WhenDamageIsPositive_ShouldReduceHealth`) để khi test fail, Dev/AI hiểu ngay lỗi ở đâu.
- **Tách Biệt Khỏi Scene (Zero Scene Dependency):** EditMode Test phải kiểm thử class C# thuần hoặc logic độc lập, không phụ thuộc vào việc load Scene hay GameObject tồn tại trong Hierarchy.
- **Quy tắc 3A (Arrange - Act - Assert):** Tổ chức rõ ràng 3 phần: Chuẩn bị dữ liệu (Arrange), Gọi hành vi (Act), Kiểm tra kết quả (Assert).
- **Tốc độ Thực thi:** Mỗi test case phải chạy dưới **10ms** để toàn bộ test suite chạy xong trong < 1 giây.

---

# 4. Implementation Steps
1. Đặt file test trong thư mục `Assets/_Project/Tests/EditMode/`.
2. Tạo file `.asmdef` cho Tests có tham chiếu đến `UnityEditor.TestRunner` và `UnityEngine.TestRunner` kèm flag `Test Assemblies: true`.
3. Viết các test cases theo mẫu NUnit (`[Test]`, `[TestCase]`, `[SetUp]`, `[TearDown]`).
4. Chạy test tự động qua Unity MCP (`run_tests`) hoặc Unity Test Runner window.

---

# 5. Runtime Gotchas
- **Test Assemblies trong Bản Build:** File test quên bật cờ `Editor / Test Assembly` sẽ bị gom vào bản Build release của game, làm tăng dung lượng game vô ích.
- **Dữ liệu tĩnh bị rò rỉ (Static State Leak):** Sử dụng biến `static` mà không reset trong `[TearDown]` sẽ khiến test case chạy sau bị ảnh hưởng bởi kết quả của test case chạy trước.

---

# 6. Verification
- Chạy kỹ năng `/test-run` hoặc gọi `run_tests` qua Unity MCP.
- Tất cả các test cases phải hiển thị màu xanh (100% Passed).
